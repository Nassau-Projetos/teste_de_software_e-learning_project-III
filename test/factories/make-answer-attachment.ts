import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import {
	AnswerAttachment,
	AnswerAttachmentProps,
} from '@/api/domain/forum/enterprise/entities/answer-attachment'

export function makeAnswerAttachment(
	override: Partial<AnswerAttachmentProps> = {},
	id?: UniqueEntityId,
) {
	const answerAttachment = AnswerAttachment.create(
		{
			answerId: new UniqueEntityId(),
			attachmentId: new UniqueEntityId(),
			...override,
		},
		id,
	)

	return answerAttachment
}
