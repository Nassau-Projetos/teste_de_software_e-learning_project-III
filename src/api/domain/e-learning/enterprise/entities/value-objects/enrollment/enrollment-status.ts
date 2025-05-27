import {
	ENROLLMENT_INFO,
	ENROLLMENT_STATUS,
} from '@/api/core/enums/enrollment-status'
import { getEnrollmentByValue } from '@/api/core/utils/get-enrollment-by-value'

export class EnrollmentStatus {
	private constructor(private readonly _value: number) {
		if (_value < 0) {
			throw new Error('Enrollment status cannot be negative')
		}
	}

	get value(): number {
		return this._value
	}

	get key(): string {
		return ENROLLMENT_INFO[this._value]?.key ?? 'UNKNOWN'
	}

	get label(): string {
		return ENROLLMENT_INFO[this._value]?.label ?? 'Unknown Status'
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

	static fromValue(
		value: ENROLLMENT_STATUS | number | string,
	): EnrollmentStatus {
		if (typeof value === 'string') {
			const byKey = getEnrollmentByValue(value)
			if (byKey) return new EnrollmentStatus(byKey)

			const parsedNumber = Number(value)
			if (!isNaN(parsedNumber)) return new EnrollmentStatus(parsedNumber)
		}

		if (typeof value === 'number') return new EnrollmentStatus(value)

		throw new Error(`Invalid Enrollment Status: ${value}`)
	}

	static PENDING = new EnrollmentStatus(ENROLLMENT_STATUS.PENDING)
	static ACTIVE = new EnrollmentStatus(ENROLLMENT_STATUS.ACTIVE)
	static CANCELLED = new EnrollmentStatus(ENROLLMENT_STATUS.CANCELLED)
	static COMPLETED = new EnrollmentStatus(ENROLLMENT_STATUS.COMPLETED)
}
