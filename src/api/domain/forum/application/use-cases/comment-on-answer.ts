import { Either, left, right } from '@/api/core/either/either'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { AnswersRepository } from '../repositories/answers-repository'

interface CommentOnAnswerUseCaseRequest {
	authorId: string
	answerId: string
	content: string
}

type CommentOnAnswerUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		answerComment: AnswerComment
	}
>

export class CommentOnAnswerUseCase {
	constructor(
		private answerRepository: AnswersRepository,
		private answerCommentRepository: AnswerCommentsRepository,
	) {}

	async execute({
		authorId,
		answerId,
		content,
	}: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
		const answer = this.answerRepository.findById(answerId)

		if (!answer) {
			return left(new ResourceNotFoundError())
		}

		const answerComment = AnswerComment.create({
			authorId: new UniqueEntityId(authorId),
			answerId: new UniqueEntityId(answerId),
			content,
		})

		await this.answerCommentRepository.create(answerComment)

		return right({ answerComment })
	}
}
