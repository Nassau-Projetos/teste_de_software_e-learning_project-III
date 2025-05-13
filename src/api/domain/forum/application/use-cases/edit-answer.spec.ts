import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'

describe('Edit Answer', () => {
	let inMemoryAnswersRepository: InMemoryAnswersRepository
	let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
	let sut: EditAnswerUseCase

	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		)
		sut = new EditAnswerUseCase(
			inMemoryAnswersRepository,
			inMemoryAnswerAttachmentsRepository,
		)
	})

	it('should be able to edit a answer', async () => {
		const newAnswer = makeAnswer(
			{ authorId: new UniqueEntityId('author-1') },
			new UniqueEntityId('answer-1'),
		)

		inMemoryAnswersRepository.create(newAnswer)

		inMemoryAnswerAttachmentsRepository.items.push(
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityId('1'),
			}),
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityId('2'),
			}),
		)

		const result = await sut.execute({
			answerId: 'answer-1',
			authorId: 'author-1',
			content: 'Conteúdo teste',
			attachmentsIds: ['1', '3'],
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryAnswersRepository.items[0]).toMatchObject({
			content: 'Conteúdo teste',
		})
		expect(
			inMemoryAnswersRepository.items[0].attachments.currentItems,
		).toHaveLength(2)
		expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
			[
				expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
				expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
			],
		)
	})

	it('should not be able to edit a answer from another user', async () => {
		const newAnswer = makeAnswer(
			{ authorId: new UniqueEntityId('author-1') },
			new UniqueEntityId('answer-1'),
		)

		inMemoryAnswersRepository.create(newAnswer)

		const result = await sut.execute({
			answerId: 'answer-1',
			authorId: 'author-2',
			content: 'Conteúdo teste',
			attachmentsIds: [],
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
