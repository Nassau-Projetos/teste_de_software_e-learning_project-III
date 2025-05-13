import { Either, left, right } from '@/api/core/either/either'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Answer } from '../../enterprise/entities/answer'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswersRepository } from '../repositories/answers-repository'

interface EditAnswerUseCaseRequest {
	authorId: string
	answerId: string
	content: string
	attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		answer: Answer
	}
>

export class EditAnswerUseCase {
	constructor(
		private answerRepository: AnswersRepository,
		private answerAttachmetnsRepository: AnswerAttachmentsRepository,
	) {}

	async execute({
		authorId,
		answerId,
		content,
		attachmentsIds,
	}: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
		const answer = await this.answerRepository.findById(answerId)

		if (!answer) {
			return left(new ResourceNotFoundError())
		}

		if (authorId != answer.authorId.toString()) {
			return left(new NotAllowedError())
		}

		const currentAnswerAttachments =
			await this.answerAttachmetnsRepository.findManyByAnswerId(answerId)

		const answerAttachmentsList = new AnswerAttachmentList(
			currentAnswerAttachments,
		)

		const answerAttachments = attachmentsIds.map((attachmentsId) => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityId(attachmentsId),
				answerId: answer.id,
			})
		})

		answerAttachmentsList.update(answerAttachments)

		answer.content = content
		answer.attachments = answerAttachmentsList

		await this.answerRepository.save(answer)

		return right({ answer })
	}
}
