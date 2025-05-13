import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'

describe('Edit Question', () => {
	let inMemoryQuestionsRepository: InMemoryQuestionsRepository
	let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
	let sut: EditQuestionUseCase

	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		)
		sut = new EditQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionAttachmentsRepository,
		)
	})

	it('should be able to edit a question', async () => {
		const newQuestion = makeQuestion(
			{ authorId: new UniqueEntityId('author-1') },
			new UniqueEntityId('question-1'),
		)

		await inMemoryQuestionsRepository.create(newQuestion)

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId('1'),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId('2'),
			}),
		)

		const result = await sut.execute({
			questionId: 'question-1',
			authorId: 'author-1',
			title: 'Pergunta teste',
			content: 'Conteúdo teste',
			attachmentsIds: ['1', '3'],
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
			title: 'Pergunta teste',
			content: 'Conteúdo teste',
		})
		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems,
		).toHaveLength(2)
		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems,
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
		])
	})

	it('should not be able to edit a question from another user', async () => {
		const newQuestion = makeQuestion(
			{ authorId: new UniqueEntityId('author-1') },
			new UniqueEntityId('question-1'),
		)

		inMemoryQuestionsRepository.create(newQuestion)

		const result = await sut.execute({
			questionId: 'question-1',
			authorId: 'author-2',
			title: 'Pergunta teste',
			content: 'Conteúdo teste',
			attachmentsIds: [],
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
