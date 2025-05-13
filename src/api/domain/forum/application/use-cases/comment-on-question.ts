import { Either, left, right } from '@/api/core/either/either'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { QuestionsRepository } from '../repositories/questions-repository'

interface CommentOnQuestionUseCaseRequest {
	authorId: string
	questionId: string
	content: string
}

type CommentOnQuestionUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		questionComment: QuestionComment
	}
>

export class CommentOnQuestionUseCase {
	constructor(
		private questionRepository: QuestionsRepository,
		private questionCommentsRepository: QuestionCommentsRepository,
	) {}

	async execute({
		authorId,
		questionId,
		content,
	}: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
		const question = this.questionRepository.findById(questionId)

		if (!question) {
			return left(new ResourceNotFoundError())
		}

		const questionComment = QuestionComment.create({
			authorId: new UniqueEntityId(authorId),
			questionId: new UniqueEntityId(questionId),
			content,
		})

		await this.questionCommentsRepository.create(questionComment)

		return right({ questionComment })
	}
}
