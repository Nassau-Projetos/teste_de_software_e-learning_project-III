import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { DomainEvent } from '@/api/core/events/domain-event'

export class PaymentCompletedEvent implements DomainEvent {
	public occurredAt: Date
	public name: string

	//TODO: Utilizar
	constructor(
		public readonly paymentId: UniqueEntityId,
		public readonly enrollmentId: UniqueEntityId,
	) {
		this.occurredAt = new Date()
		this.name = 'payment.completed'
	}

	getAggregateId(): UniqueEntityId {
		return this.paymentId
	}
}
