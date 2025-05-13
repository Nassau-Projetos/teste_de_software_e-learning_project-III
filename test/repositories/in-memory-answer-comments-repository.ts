import { PaginationParams } from '@/api/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/api/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/api/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
	implements AnswerCommentsRepository
{
	public items: AnswerComment[] = []

	async findById(id: string) {
		const answerComment = this.items.find((item) => item.id.toString() === id)

		if (!answerComment) {
			return null
		}

		return answerComment
	}

	async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
		const answerComments = this.items
			.filter((item) => item.answerId.toString() === answerId)
			.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
			.slice((page - 1) * 20, page * 20)

		return answerComments
	}

	async create(answerComment: AnswerComment) {
		this.items.push(answerComment)
	}

	async delete(answerComment: AnswerComment) {
		const itemIndex = this.items.findIndex(
			(item) => item.id === answerComment.id,
		)

		this.items.splice(itemIndex, 1)
	}
}
