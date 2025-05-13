import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import {
	AnswerComment,
	AnswerCommentProps,
} from '@/api/domain/forum/enterprise/entities/answer-comment'
import { faker } from '@faker-js/faker'

export function makeAnswerComment(
	override: Partial<AnswerCommentProps> = {},
	id?: UniqueEntityId,
) {
	const answerComment = AnswerComment.create(
		{
			authorId: new UniqueEntityId(),
			answerId: new UniqueEntityId(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	)

	return answerComment
}
