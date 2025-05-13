import { DomainEvents } from '@/api/core/events/domain-events'
import { PaginationParams } from '@/api/core/repositories/pagination-params'
import { AnswersRepository } from '@/api/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/api/domain/forum/enterprise/entities/answer'
import { InMemoryAnswerAttachmentsRepository } from './in-memory-answer-attachments-repository'

export class InMemoryAnswersRepository implements AnswersRepository {
	constructor(
		private inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository,
	) {}

	public items: Answer[] = []

	async findById(id: string) {
		const answer = this.items.find((item) => item.id.toString() === id)

		if (!answer) {
			return null
		}

		return answer
	}

	async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
		const answers = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
			.slice((page - 1) * 20, page * 20)

		return answers
	}

	async create(answer: Answer) {
		this.items.push(answer)

		DomainEvents.dispatchEventsForAggregate(answer.id)
	}

	async save(answer: Answer): Promise<void> {
		const itemIndex = this.items.findIndex((item) => item.id === answer.id)

		this.items[itemIndex] = answer

		DomainEvents.dispatchEventsForAggregate(answer.id)
	}

	async delete(answer: Answer) {
		const itemIndex = this.items.findIndex((item) => item.id === answer.id)

		this.items.splice(itemIndex, 1)

		this.inMemoryAnswerAttachmentsRepository.deleteManyByAnswerId(
			answer.id.toString(),
		)
	}
}
