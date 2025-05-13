import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentsUseCase } from './delete-answer-comments'

describe('Delete Answer Comments', () => {
	let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
	let sut: DeleteAnswerCommentsUseCase

	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
		sut = new DeleteAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
	})

	it('should be able to delete a answer', async () => {
		const newAnswerComment = makeAnswerComment()

		inMemoryAnswerCommentsRepository.create(newAnswerComment)

		const result = await sut.execute({
			answerCommentId: newAnswerComment.id.toString(),
			authorId: newAnswerComment.authorId.toString(),
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
	})

	it('should not be able to delete a answer from another user', async () => {
		const newAnswerComment = makeAnswerComment({
			authorId: new UniqueEntityId('author-1'),
		})

		inMemoryAnswerCommentsRepository.create(newAnswerComment)

		const result = await sut.execute({
			answerCommentId: newAnswerComment.id.toString(),
			authorId: 'author-2',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
