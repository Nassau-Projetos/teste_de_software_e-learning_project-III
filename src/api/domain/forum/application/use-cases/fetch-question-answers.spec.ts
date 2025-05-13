import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'

describe('Fetch Question Answers', () => {
	let inMemoryAnswersRepository: InMemoryAnswersRepository
	let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
	let sut: FetchQuestionAnswersUseCase

	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		)
		sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
	})

	it('should be able to fetch recent questions', async () => {
		await inMemoryAnswersRepository.create(
			makeAnswer({
				questionId: new UniqueEntityId('question-1'),
				createdAt: new Date(2022, 0, 20),
			}),
		)
		await inMemoryAnswersRepository.create(
			makeAnswer({
				questionId: new UniqueEntityId('question-1'),
				createdAt: new Date(2022, 0, 18),
			}),
		)
		await inMemoryAnswersRepository.create(
			makeAnswer({
				questionId: new UniqueEntityId('question-1'),
				createdAt: new Date(2022, 0, 23),
			}),
		)

		const result = await sut.execute({ questionId: 'question-1', page: 1 })

		expect(result.value?.answers).toEqual([
			expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
		])
		expect(result.value?.answers).toHaveLength(3)
	})

	it('should be able to fetch paginated recent questions', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswersRepository.create(
				makeAnswer({ questionId: new UniqueEntityId('question-1') }),
			)
		}

		const result = await sut.execute({ questionId: 'question-1', page: 2 })

		expect(result.value?.answers).toHaveLength(2)
	})
})
