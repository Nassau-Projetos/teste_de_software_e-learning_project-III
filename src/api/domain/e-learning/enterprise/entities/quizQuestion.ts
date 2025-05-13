import { Entity } from '@/api/core/entities/entity'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Alternative } from './value-objects/quiz/alternative'

export interface QuizQuestionProps {
	text: string
	alternatives: Alternative[]
	correctAlternativeId: string
}

export class QuizQuestion extends Entity<QuizQuestionProps> {
	get text() {
		return this.props.text
	}

	get alternatives() {
		return this.props.alternatives
	}

	get correctAlternativeId() {
		return this.props.correctAlternativeId
	}

	isCorrect(alternativeId: string): boolean {
		return this.props.correctAlternativeId === alternativeId
	}

	changeCorrectAlternative(alternativeId: string) {
		const exists = this.props.alternatives.some(
			(alt) => alt.id.toString() === alternativeId,
		)

		if (!exists) {
			throw new Error('Alternativa não pertence a esta pergunta.')
		}

		this.props.correctAlternativeId = alternativeId
	}

	static create(props: QuizQuestionProps, id?: UniqueEntityId) {
		const hasCorrect = props.alternatives.some(
			(alt) => alt.id.toString() === props.correctAlternativeId,
		)

		if (!hasCorrect) {
			throw new Error(
				'Alternativa correta não pertence à lista de alternativas.',
			)
		}

		return new QuizQuestion(props, id)
	}
}
