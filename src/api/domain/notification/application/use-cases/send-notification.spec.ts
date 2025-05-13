import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notification-repository'
import { SendNotificationUseCase } from './send-notification'

describe('Send Notification', () => {
	let inMemoryNotificationsRepository: InMemoryNotificationsRepository
	let sut: SendNotificationUseCase

	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
		sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
	})

	it('should be able to send a notification', async () => {
		const result = await sut.execute({
			title: 'Nova pergunta',
			recipientId: '1',
			content: 'Conteúdo da pergunta',
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryNotificationsRepository.items[0]).toEqual(
			result.value?.notification,
		)
	})
})
