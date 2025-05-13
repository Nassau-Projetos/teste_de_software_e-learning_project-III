import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

describe('Comment On Question', () => {
	let inMemoryQuestionRepository: InMemoryQuestionsRepository
	let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
	let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
	let sut: CommentOnQuestionUseCase

	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentsRepository()
		inMemoryQuestionRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		)
		sut = new CommentOnQuestionUseCase(
			inMemoryQuestionRepository,
			inMemoryQuestionCommentsRepository,
		)
	})

	it('should be able to choose question best answer', async () => {
		const question = makeQuestion()

		await inMemoryQuestionRepository.create(question)

		const result = await sut.execute({
			questionId: question.id.toString(),
			authorId: question.authorId.toString(),
			content: 'Comentário teste',
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
			'Comentário teste',
		)
	})
})
