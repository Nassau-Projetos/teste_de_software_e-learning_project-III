import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

describe('Fetch Answer Comments', () => {
	let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
	let sut: FetchAnswerCommentsUseCase

	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
		sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
	})

	it('should be able to fetch recent answers', async () => {
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({
				answerId: new UniqueEntityId('answer-1'),
				createdAt: new Date(2022, 0, 20),
			}),
		)
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({
				answerId: new UniqueEntityId('answer-1'),
				createdAt: new Date(2022, 0, 18),
			}),
		)
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({
				answerId: new UniqueEntityId('answer-1'),
				createdAt: new Date(2022, 0, 23),
			}),
		)

		const result = await sut.execute({
			answerId: 'answer-1',
			page: 1,
		})

		expect(result.value?.answerComments).toEqual([
			expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
		])
		expect(result.value?.answerComments).toHaveLength(3)
	})

	it('should be able to fetch paginated recent answers', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswerCommentsRepository.create(
				makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
			)
		}

		const result = await sut.execute({
			answerId: 'answer-1',
			page: 2,
		})

		expect(result.value?.answerComments).toHaveLength(2)
	})
})
