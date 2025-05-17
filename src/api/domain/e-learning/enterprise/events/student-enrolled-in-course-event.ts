import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { DomainEvent } from '@/api/core/events/domain-event'

export class StudentEnrolledInCourseEvent extends DomainEvent {
	constructor(
		public readonly studentId: UniqueEntityId,
		public readonly courseId: UniqueEntityId,
		public readonly enrollmentId: UniqueEntityId,
	) {
		super()
		this.occurredAt = new Date()
		this.name = 'student.enrolled-in-course'
	}

	getAggregateId(): UniqueEntityId {
		return this.studentId
	}
}
