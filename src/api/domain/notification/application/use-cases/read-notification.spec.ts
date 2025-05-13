import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notification-repository'
import { ReadNotificationUseCase } from './read-notification'

describe('Read Notification', () => {
	let inMemoryNotificationsRepository: InMemoryNotificationsRepository
	let sut: ReadNotificationUseCase

	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
		sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
	})

	it('should be able to read a notification', async () => {
		const notification = makeNotification()

		inMemoryNotificationsRepository.create(notification)

		const result = await sut.execute({
			recipientId: notification.recipientId.toString(),
			notificationId: notification.id.toString(),
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
			expect.any(Date),
		)
	})

	it('should not be able to delete a notification from another user', async () => {
		const newNotification = makeNotification({
			recipientId: new UniqueEntityId('recipient-1'),
		})

		inMemoryNotificationsRepository.create(newNotification)

		const result = await sut.execute({
			notificationId: newNotification.id.toString(),
			recipientId: 'recipient-2',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
