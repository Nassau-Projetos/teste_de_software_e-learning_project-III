import { Either, left, right } from '@/api/core/either/either'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Question } from '../../enterprise/entities/question'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionsRepository } from '../repositories/questions-repository'

interface EditQuestionUseCaseRequest {
	authorId: string
	questionId: string
	title: string
	content: string
	attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		question: Question
	}
>

export class EditQuestionUseCase {
	constructor(
		private questionRepository: QuestionsRepository,
		private questionAttachmentsRepository: QuestionAttachmentsRepository,
	) {}

	async execute({
		authorId,
		questionId,
		title,
		content,
		attachmentsIds,
	}: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
		const question = await this.questionRepository.findById(questionId)

		if (!question) {
			return left(new ResourceNotFoundError())
		}

		if (authorId != question.authorId.toString()) {
			return left(new NotAllowedError())
		}

		const currentQuestionAttachments =
			await this.questionAttachmentsRepository.findManyByQuestionId(questionId)

		const questionAttachmentsList = new QuestionAttachmentList(
			currentQuestionAttachments,
		)

		const questionAttachments = attachmentsIds.map((attachmentsId) => {
			return QuestionAttachment.create({
				attachmentId: new UniqueEntityId(attachmentsId),
				questionId: question.id,
			})
		})

		questionAttachmentsList.update(questionAttachments)

		question.title = title
		question.content = content
		question.attachments = questionAttachmentsList

		await this.questionRepository.save(question)

		return right({ question })
	}
}
