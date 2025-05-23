import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'

export class QuizAnswer {
	private constructor(
		private readonly questionId: UniqueEntityId,
		private readonly selectedAlternativeId: UniqueEntityId,
	) {}

	static create(
		questionId: UniqueEntityId,
		selectedAlternativeId: UniqueEntityId,
	): QuizAnswer {
		if (!questionId || !selectedAlternativeId) {
			throw new Error('IDs da questão e da alternativa são obrigatórios.')
		}
		return new QuizAnswer(questionId, selectedAlternativeId)
	}

	getQuestionId(): UniqueEntityId {
		return this.questionId
	}

	getSelectedAlternativeId(): UniqueEntityId {
		return this.selectedAlternativeId
	}

	equals(other: QuizAnswer): boolean {
		return (
			this.questionId.equals(other.getQuestionId()) &&
			this.selectedAlternativeId.equals(other.getSelectedAlternativeId())
		)
	}
}
