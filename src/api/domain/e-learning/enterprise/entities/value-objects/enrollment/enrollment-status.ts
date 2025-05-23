import { ENROLLMENT_STATUS } from '@/api/core/enums/enrollment-status'

export class EnrollmentStatus {
	private constructor(private readonly _value: number) {
		if (_value < 0) {
			throw new Error('O status de enrollment não pode ser negativo')
		}
	}

	get value(): number {
		return this._value
	}

	toString(): string {
		return this._value.toString()
	}

	equals(other: EnrollmentStatus): boolean {
		return this._value === other.value
	}

	isPending() {
		return this.equals(EnrollmentStatus.PENDING)
	}

	isActive() {
		return this.equals(EnrollmentStatus.ACTIVE)
	}

	isCanceled() {
		return this.equals(EnrollmentStatus.CANCELLED)
	}

	IsCompleted() {
		return this.equals(EnrollmentStatus.COMPLETED)
	}

	static PENDING = new EnrollmentStatus(ENROLLMENT_STATUS.PENDING)
	static ACTIVE = new EnrollmentStatus(ENROLLMENT_STATUS.ACTIVE)
	static CANCELLED = new EnrollmentStatus(ENROLLMENT_STATUS.CANCELLED)
	static COMPLETED = new EnrollmentStatus(ENROLLMENT_STATUS.COMPLETED)
}
