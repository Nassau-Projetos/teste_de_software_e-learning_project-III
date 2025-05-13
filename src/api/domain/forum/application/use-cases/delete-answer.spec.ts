import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'

describe('Delete Answer', () => {
	let inMemoryAnswersRepository: InMemoryAnswersRepository
	let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
	let sut: DeleteAnswerUseCase

	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		)
		sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
	})

	it('should be able to delete an answer', async () => {
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
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryAnswersRepository.items).toHaveLength(0)
		expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
	})

	it('should not be able to delete an answer from another user', async () => {
		const newAnswer = makeAnswer(
			{ authorId: new UniqueEntityId('author-1') },
			new UniqueEntityId('answer-1'),
		)

		inMemoryAnswersRepository.create(newAnswer)

		const result = await sut.execute({
			answerId: 'answer-1',
			authorId: 'author-2',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
