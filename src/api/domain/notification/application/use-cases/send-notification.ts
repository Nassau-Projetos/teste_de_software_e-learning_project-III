import { Either, right } from '@/api/core/either/either'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notification-repository'

export interface SendNotificationUseCaseRequest {
	recipientId: string
	title: string
	content: string
}

export type SendNotificationUseCaseResponse = Either<
	null,
	{
		notification: Notification
	}
>

export class SendNotificationUseCase {
	constructor(private notificationRepository: NotificationsRepository) {}

	async execute({
		recipientId,
		title,
		content,
	}: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
		const notification = Notification.create({
			recipientId: new UniqueEntityId(recipientId),
			title,
			content,
		})

		await this.notificationRepository.create(notification)

		return right({ notification })
	}
}
