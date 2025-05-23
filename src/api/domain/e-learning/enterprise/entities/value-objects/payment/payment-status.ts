import { PAYMENT_STATUS } from '@/api/core/enums/payment-status'

export class PaymentStatus {
	private constructor(private readonly _value: number) {
		if (_value < 0) {
			throw new Error('O status de payment não pode ser negativo')
		}
	}

	get value(): number {
		return this._value
	}

	toString(): string {
		return this._value.toString()
	}

	equals(other: PaymentStatus): boolean {
		return this._value === other.value
	}

	isPending() {
		return this.equals(PaymentStatus.PENDING)
	}

	isApproved() {
		return this.equals(PaymentStatus.APPROVED)
	}

	isRejected() {
		return this.equals(PaymentStatus.REJECTED)
	}

	isCancelled() {
		return this.equals(PaymentStatus.CANCELLED)
	}

	static PENDING = new PaymentStatus(PAYMENT_STATUS.PENDING)
	static APPROVED = new PaymentStatus(PAYMENT_STATUS.APPROVED)
	static REJECTED = new PaymentStatus(PAYMENT_STATUS.REJECTED)
	static CANCELLED = new PaymentStatus(PAYMENT_STATUS.CANCELLED)
}
