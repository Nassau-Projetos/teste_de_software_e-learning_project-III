import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { DomainEvents } from '@/api/core/events/domain-events'
import { Optional } from '@/api/core/types/optional'
import { EnrollmentRequestedEvent } from '../events/enrollment-requested-event'
import { CourseRating } from './course-rating'
import { Enrollment } from './enrollment'
import { Quiz } from './quiz'
import { User, UserProps } from './user'
import { QuizAnswer } from './value-objects/quiz/quiz-answer'
import { QuizAttempt } from './value-objects/quiz/quiz-attempt'

export interface StudentProps extends UserProps {
	name: string
	cpf: string
	phoneNumber?: string | null
	enrollments?: Enrollment[]
	attempts?: QuizAttempt[]
	createdAt: Date
	updatedAt?: Date | null
}

export class Student extends User<StudentProps> {
	get name() {
		return this.props.name
	}

	get cpf() {
		return this.props.cpf
	}

	get phoneNumber() {
		return this.props.phoneNumber ?? null
	}

	get enrollments(): Enrollment[] {
		return this.props.enrollments ?? []
	}

	get attempts(): QuizAttempt[] {
		return this.props.attempts ?? []
	}

	get createdAt() {
		return this.props.createdAt
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	requestEnroll(courseId: UniqueEntityId) {
		const exists = this.enrollments.find((e) => e.courseId.equals(courseId))
		if (exists) {
			throw new Error('Já está inscrito no curso')
		}

		const enrollment = Enrollment.createPedingEnrollment({
			studentId: this.id,
			courseId,
		})

		this.props.enrollments = [...this.enrollments, enrollment]
		this.addDomainEvent(
			new EnrollmentRequestedEvent(this.id, courseId, enrollment.id),
		)
		DomainEvents.markAggregateForDispatch(this)
		this.touch()

		return enrollment
	}

	cancelEnrollment(courseId: UniqueEntityId) {
		const initialLength = this.enrollments.length
		this.props.enrollments = this.enrollments.filter(
			(e) => !e.courseId.equals(courseId),
		)

		if (this.enrollments.length === initialLength) {
			throw new Error('Inscrição não encontrada')
		}

		this.touch()
	}

	rateCourse(
		courseId: UniqueEntityId,
		value: number,
		comment?: string,
		existingRating?: CourseRating | null,
	): CourseRating {
		if (value < 1 || value > 5) {
			throw new Error('Nota deve estar entre 1 e 5')
		}

		if (existingRating) {
			existingRating.updateRating(value, comment)
			return existingRating
		}

		return CourseRating.create({
			courseId,
			studentId: this.id,
			value,
			comment,
		})
	}

	canAttemptQuiz(quiz: Quiz): boolean {
		const previousAttempts = this.attempts.filter((a) =>
			a.quizId.equals(quiz.id),
		)
		return quiz.canBeRetaken(previousAttempts.length)
	}

	submitQuiz(quiz: Quiz, answers: QuizAnswer[]): QuizAttempt {
		if (!this.canAttemptQuiz(quiz)) {
			throw new Error('Limite de tentativas atingido')
		}

		const answersRecord: Record<string, string> = {}
		const quizAnswers = answers.map((answer) => {
			const questionId = answer.getQuestionId()
			const selectedAlternativeId = answer.getSelectedAlternativeId()

			answersRecord[questionId.toString()] = selectedAlternativeId.toString()

			return QuizAnswer.create(questionId, selectedAlternativeId)
		})

		const score = quiz.grade(answersRecord)
		const passed = quiz.isPassed(score)

		const attempt = QuizAttempt.create({
			studentId: this.id,
			quizId: quiz.id,
			answers: quizAnswers,
			score,
			passed,
		})

		this.props.attempts = [...this.attempts, attempt]
		this.touch()

		return attempt
	}

	updateDetails(details: {
		name?: string
		phoneNumber?: string
		email?: string
		passwordHash?: string
	}) {
		let updated = false

		if (details.name && details.name !== this.props.name) {
			if (!details.name || details.name.trim().length === 0) {
				throw new Error('Nome não pode ser vazio')
			}
			this.props.name = details.name
			updated = true
		}

		if (details.phoneNumber && details.phoneNumber !== this.props.phoneNumber) {
			this.props.phoneNumber = details.phoneNumber
			updated = true
		}

		if (details.email && details.email !== this.props.email) {
			if (!details.email || details.email.trim().length === 0) {
				throw new Error('Email não pode ser vazio')
			}
			this.props.email = details.email
			updated = true
		}

		if (
			details.passwordHash &&
			details.passwordHash !== this.props.passwordHash
		) {
			if (!details.passwordHash || details.passwordHash.trim().length === 0) {
				throw new Error('Password não pode ser vazio')
			}
			this.props.passwordHash = details.passwordHash
			updated = true
		}

		this.updateUserDetailsBase(details)
		if (updated) {
			this.touch()
		}
	}

	static create(
		props: Optional<StudentProps, 'createdAt' | 'enrollments' | 'attempts'>,
		id?: UniqueEntityId,
	) {
		return new Student(
			{
				...props,
				enrollments: props.enrollments ?? [],
				attempts: props.attempts ?? [],
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		)
	}
}
