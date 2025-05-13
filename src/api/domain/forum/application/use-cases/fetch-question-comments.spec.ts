import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

describe('Fetch Question Comments', () => {
	let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
	let sut: FetchQuestionCommentsUseCase

	beforeEach(() => {
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentsRepository()
		sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
	})

	it('should be able to fetch recent questions', async () => {
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityId('question-1'),
				createdAt: new Date(2022, 0, 20),
			}),
		)
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityId('question-1'),
				createdAt: new Date(2022, 0, 18),
			}),
		)
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityId('question-1'),
				createdAt: new Date(2022, 0, 23),
			}),
		)

		const result = await sut.execute({
			questionId: 'question-1',
			page: 1,
		})

		expect(result.value?.questionComments).toEqual([
			expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
		])
		expect(result.value?.questionComments).toHaveLength(3)
	})

	it('should be able to fetch paginated recent questions', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryQuestionCommentsRepository.create(
				makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
			)
		}

		const result = await sut.execute({
			questionId: 'question-1',
			page: 2,
		})

		expect(result.value?.questionComments).toHaveLength(2)
	})
})
