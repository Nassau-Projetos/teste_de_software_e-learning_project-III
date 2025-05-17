import { UniqueEntityId } from '../entities/value-objects/unique-entity-id'

export abstract class DomainEvent {
	occurredAt: Date
	name: string
	abstract getAggregateId(): UniqueEntityId
}
