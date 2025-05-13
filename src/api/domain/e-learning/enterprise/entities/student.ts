import { AggregateRoot } from '@/api/core/entities/aggregate-root'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Optional } from '@/api/core/types/optional'
import { Enrollment } from './enrollment'
import { Quiz } from './quiz'
import { QuizAnswer } from './value-objects/quiz/quizAnswer'
import { QuizAttempt } from './value-objects/quiz/quizAttempt'

interface StudentProps {
	name: string
	email: string
	enrollments?: Enrollment[]
	attempts?: QuizAttempt[]
	createdAt: Date
	updatedAt?: Date | null
}

export class Student extends AggregateRoot<StudentProps> {
	get name() {
		return this.props.name
	}

	get email() {
		return this.props.email
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

	private touch() {
		this.props.updatedAt = new Date()
	}

	enroll(courseId: UniqueEntityId) {
		const exists = this.enrollments.find((e) => e.courseId.equals(courseId))
		if (exists) {
			throw new Error('Já está inscrito no curso')
		}

		const enrollment = Enrollment.create({
			studentId: this.id,
			courseId,
		})

		this.props.enrollments = [...this.enrollments, enrollment]
		this.touch()
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
