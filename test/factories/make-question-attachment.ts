import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import {
	QuestionAttachment,
	QuestionAttachmentProps,
} from '@/api/domain/forum/enterprise/entities/question-attachment'

export function makeQuestionAttachment(
	override: Partial<QuestionAttachmentProps> = {},
	id?: UniqueEntityId,
) {
	const questionAttachment = QuestionAttachment.create(
		{
			questionId: new UniqueEntityId(),
			attachmentId: new UniqueEntityId(),
			...override,
		},
		id,
	)

	return questionAttachment
}
