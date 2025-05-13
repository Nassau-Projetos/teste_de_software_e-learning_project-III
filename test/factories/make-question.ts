import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Slug } from '@/api/domain/e-learning/enterprise/entities/value-objects/slug/slug'
import {
	Question,
	QuestionProps,
} from '@/api/domain/forum/enterprise/entities/question'
import { faker } from '@faker-js/faker'

export function makeQuestion(
	override: Partial<QuestionProps> = {},
	id?: UniqueEntityId,
) {
	const question = Question.create(
		{
			authorId: new UniqueEntityId(),
			title: faker.lorem.sentence(),
			content: faker.lorem.text(),
			slug: Slug.create('example-question'),
			...override,
		},
		id,
	)

	return question
}
