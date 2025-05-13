import { IncrementalEntityId } from '@/api/core/entities/value-objects/incremental-entity-id'
import { ENROLLMENT_STATUS } from '@/api/core/enums/enrollment-status'

export class EnrollmentStatus extends IncrementalEntityId {
	static ACTIVE = new EnrollmentStatus(ENROLLMENT_STATUS.ACTIVE)
	static CANCELLED = new EnrollmentStatus(ENROLLMENT_STATUS.CANCELLED)
	static COMPLETED = new EnrollmentStatus(ENROLLMENT_STATUS.COMPLETED)

	isActive() {
		return this.equals(EnrollmentStatus.ACTIVE)
	}

	isCanceled() {
		return this.equals(EnrollmentStatus.CANCELLED)
	}

	isCompleted() {
		return this.equals(EnrollmentStatus.COMPLETED)
	}
}
