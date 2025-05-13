import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentsUseCase } from './delete-question-comments'

describe('Delete Question Comments', () => {
	let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
	let sut: DeleteQuestionCommentsUseCase

	beforeEach(() => {
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentsRepository()
		sut = new DeleteQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
	})

	it('should be able to delete a question', async () => {
		const newQuestionComment = makeQuestionComment()

		inMemoryQuestionCommentsRepository.create(newQuestionComment)

		const result = await sut.execute({
			questionCommentId: newQuestionComment.id.toString(),
			authorId: newQuestionComment.authorId.toString(),
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
	})

	it('should not be able to delete a question from another user', async () => {
		const newQuestionComment = makeQuestionComment({
			authorId: new UniqueEntityId('author-1'),
		})

		inMemoryQuestionCommentsRepository.create(newQuestionComment)

		const result = await sut.execute({
			questionCommentId: newQuestionComment.id.toString(),
			authorId: 'author-2',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
