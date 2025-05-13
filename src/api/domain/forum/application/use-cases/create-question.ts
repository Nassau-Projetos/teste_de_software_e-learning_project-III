import { Either, right } from '@/api/core/either/either'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionsRepository } from '../repositories/questions-repository'

interface CreateQuestionUseCaseRequest {
	authorId: string
	title: string
	content: string
	attachmentsIds: string[]
}

type CreateQuestionUseCaseResponse = Either<
	null,
	{
		question: Question
	}
>

export class CreateQuestionUseCase {
	constructor(private questionRepository: QuestionsRepository) {}

	async execute({
		authorId,
		title,
		content,
		attachmentsIds,
	}: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
		const question = Question.create({
			authorId: new UniqueEntityId(authorId),
			content,
			title,
		})

		const questionAttachments = attachmentsIds.map((attachmentId) => {
			return QuestionAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				questionId: question.id,
			})
		})

		question.attachments = new QuestionAttachmentList(questionAttachments)

		await this.questionRepository.create(question)

		return right({ question })
	}
}
