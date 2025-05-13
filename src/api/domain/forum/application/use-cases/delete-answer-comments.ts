/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Either, left, right } from '@/api/core/either/either'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface DeleteAnswerCommentsUseCaseRequest {
	authorId: string
	answerCommentId: string
}

type DeleteAnswerCommentsUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{}
>

export class DeleteAnswerCommentsUseCase {
	constructor(private answerCommentRepository: AnswerCommentsRepository) {}

	async execute({
		authorId,
		answerCommentId,
	}: DeleteAnswerCommentsUseCaseRequest): Promise<DeleteAnswerCommentsUseCaseResponse> {
		const answerComment =
			await this.answerCommentRepository.findById(answerCommentId)

		if (!answerComment) {
			return left(new ResourceNotFoundError())
		}

		if (authorId != answerComment.authorId.toString()) {
			return left(new NotAllowedError())
		}

		await this.answerCommentRepository.delete(answerComment)

		return right({})
	}
}
