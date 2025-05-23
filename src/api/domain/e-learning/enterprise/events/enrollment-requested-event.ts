import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { DomainEvent } from '@/api/core/events/domain-event'

export class EnrollmentRequestedEvent implements DomainEvent {
	public occurredAt: Date
	public name: string

	constructor(
		public readonly studentId: UniqueEntityId,
		public readonly courseId: UniqueEntityId,
		public readonly enrollmentId: UniqueEntityId,
	) {
		this.occurredAt = new Date()
		this.name = 'enrollment.request'
	}

	getAggregateId(): UniqueEntityId {
		return this.studentId
	}
}
