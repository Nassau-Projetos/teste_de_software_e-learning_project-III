import { Entity } from '@/api/core/entities/entity'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Optional } from '@/api/core/types/optional'
import { QuizAnswer } from './quizAnswer'

interface QuizAttemptProps {
	studentId: UniqueEntityId
	quizId: UniqueEntityId
	answers: QuizAnswer[]
	passed: boolean
	score?: number | null
	createdAt: Date
	submittedAt?: Date | null
}

export class QuizAttempt extends Entity<QuizAttemptProps> {
	get studentId() {
		return this.props.studentId
	}

	get quizId() {
		return this.props.quizId
	}

	get answers() {
		return this.props.answers
	}

	get score() {
		return this.props.score
	}

	get passed() {
		return this.props.passed
	}

	get createdAt() {
		return this.props.createdAt
	}

	get submittedAt() {
		return this.props.submittedAt
	}

	submit(answers: QuizAnswer[], score: number) {
		if (this.props.submittedAt) {
			throw new Error('Tentativa já foi submetida')
		}

		this.props.answers = answers
		this.props.score = score
		this.props.submittedAt = new Date()
	}

	static create(
		props: Optional<
			QuizAttemptProps,
			'answers' | 'submittedAt' | 'score' | 'createdAt'
		>,
		id?: UniqueEntityId,
	) {
		return new QuizAttempt(
			{
				...props,
				answers: props.answers ?? [],
				createdAt: props.createdAt ?? new Date(),
				submittedAt: props.submittedAt ?? null,
				score: props.score ?? null,
			},
			id,
		)
	}
}
