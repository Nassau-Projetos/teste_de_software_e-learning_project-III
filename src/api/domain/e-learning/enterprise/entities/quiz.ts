import { AggregateRoot } from '@/api/core/entities/aggregate-root'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Optional } from '@/api/core/types/optional'
import { QuizQuestion } from './quizQuestion'

export interface QuizProps {
	title: string
	moduleId: UniqueEntityId
	questions: QuizQuestion[]
	maxAttempts: number
	passingGrade: number
	createdAt: Date
	updatedAt?: Date | null
}

export class Quiz extends AggregateRoot<QuizProps> {
	get title() {
		return this.props.title
	}

	get moduleId() {
		return this.props.moduleId
	}

	get questions() {
		return this.props.questions
	}

	get passingGrade() {
		return this.props.passingGrade
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

	updateTitle(newTitle: string) {
		if (newTitle !== this.props.title) {
			this.props.title = newTitle
			this.touch()
		}
	}

	addQuestion(question: QuizQuestion) {
		this.props.questions.push(question)
		this.touch()
	}

	removeQuestion(questionId: string) {
		this.props.questions = this.props.questions.filter(
			(question) => question.id.toString() !== questionId,
		)
		this.touch()
	}

	grade(attempt: Record<string, string>): number {
		const total = this.props.questions.length
		let correct = 0

		for (const question of this.props.questions) {
			const selected = attempt[question.id.toString()]
			if (selected && question.isCorrect(selected)) {
				correct++
			}
		}

		return Math.round((correct / total) * 100)
	}

	canBeRetaken(previousAttempts: number): boolean {
		return previousAttempts < this.props.maxAttempts
	}

	isPassed(score: number): boolean {
		return score >= this.props.passingGrade
	}

	static create(props: Optional<QuizProps, 'createdAt'>, id?: UniqueEntityId) {
		return new Quiz(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		)
	}
}
