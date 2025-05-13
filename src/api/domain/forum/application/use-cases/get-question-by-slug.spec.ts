import { Slug } from '@/api/domain/e-learning/enterprise/entities/value-objects/slug/slug'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

describe('Get Question By Slug', () => {
	let inMemoryQuestionsRepository: InMemoryQuestionsRepository
	let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
	let sut: GetQuestionBySlugUseCase

	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		)
		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to get a question by slug', async () => {
		const newQuestion = makeQuestion({
			slug: Slug.create('example-question'),
		})

		inMemoryQuestionsRepository.create(newQuestion)

		const result = await sut.execute({
			slug: 'example-question',
		})

		expect(result.isRight()).toBe(true)
		expect(result.value?.question.title).toEqual(newQuestion.title)
	})
})
