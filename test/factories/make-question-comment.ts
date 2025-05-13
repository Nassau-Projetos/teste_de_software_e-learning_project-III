import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import {
	QuestionComment,
	QuestionCommentProps,
} from '@/api/domain/forum/enterprise/entities/question-comment'
import { faker } from '@faker-js/faker'

export function makeQuestionComment(
	override: Partial<QuestionCommentProps> = {},
	id?: UniqueEntityId,
) {
	const questionComment = QuestionComment.create(
		{
			authorId: new UniqueEntityId(),
			questionId: new UniqueEntityId(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	)

	return questionComment
}
