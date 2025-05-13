import { Either, left, right } from '@/api/core/either/either'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface DeleteQuestionCommentsUseCaseRequest {
	authorId: string
	questionCommentId: string
}

type DeleteQuestionCommentsUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	null
>

export class DeleteQuestionCommentsUseCase {
	constructor(private questionCommentRepository: QuestionCommentsRepository) {}

	async execute({
		authorId,
		questionCommentId,
	}: DeleteQuestionCommentsUseCaseRequest): Promise<DeleteQuestionCommentsUseCaseResponse> {
		const questionComment =
			await this.questionCommentRepository.findById(questionCommentId)

		if (!questionComment) {
			return left(new ResourceNotFoundError())
		}

		if (authorId != questionComment.authorId.toString()) {
			return left(new NotAllowedError())
		}

		await this.questionCommentRepository.delete(questionComment)

		return right(null)
	}
}
