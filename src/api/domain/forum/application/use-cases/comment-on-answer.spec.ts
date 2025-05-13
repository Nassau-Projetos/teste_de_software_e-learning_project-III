import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

describe('Comment On Answer', () => {
	let inMemoryAnswerRepository: InMemoryAnswersRepository
	let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
	let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
	let sut: CommentOnAnswerUseCase

	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
		inMemoryAnswerRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		)
		sut = new CommentOnAnswerUseCase(
			inMemoryAnswerRepository,
			inMemoryAnswerCommentsRepository,
		)
	})

	it('should be able to choose answer best answer', async () => {
		const answer = makeAnswer()

		await inMemoryAnswerRepository.create(answer)

		const result = await sut.execute({
			answerId: answer.id.toString(),
			authorId: answer.authorId.toString(),
			content: 'Comentário teste',
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
			'Comentário teste',
		)
	})
})
