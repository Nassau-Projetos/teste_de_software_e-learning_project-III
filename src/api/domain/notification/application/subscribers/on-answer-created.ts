import { DomainEvents } from '@/api/core/events/domain-events'
import { EventHandler } from '@/api/core/events/event-handler'
import { QuestionsRepository } from '@/api/domain/forum/application/repositories/questions-repository'
import { AnswerCreatedEvent } from '@/api/domain/forum/enterprise/events/answer-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnAnswerCreated implements EventHandler {
	constructor(
		private questionsRepository: QuestionsRepository,
		private sendNotification: SendNotificationUseCase,
	) {
		this.setupSubscriptions()
	}

	setupSubscriptions(): void {
		DomainEvents.register(
			this.sendNewAnswerNotification.bind(this),
			AnswerCreatedEvent.name,
		)
	}

	private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
		const question = await this.questionsRepository.findById(
			answer.authorId.toString(),
		)

		if (question) {
			await this.sendNotification.execute({
				recipientId: question?.authorId.toString(),
				title: `Nova resposta em "${question.title.substring(0, 40).concat('...')}"`,
				content: answer.except,
			})
		}
	}
}
