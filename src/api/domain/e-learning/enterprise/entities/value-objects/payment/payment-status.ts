import { IncrementalEntityId } from '@/api/core/entities/value-objects/incremental-entity-id'
import { PAYMENT_STATUS } from '@/api/core/enums/payment-status'

export class PaymentStatus extends IncrementalEntityId {
	static PENDING = new PaymentStatus(PAYMENT_STATUS.PENDING)
	static APPROVED = new PaymentStatus(PAYMENT_STATUS.APPROVED)
	static REJECTED = new PaymentStatus(PAYMENT_STATUS.REJECTED)
	static CANCELLED = new PaymentStatus(PAYMENT_STATUS.CANCELLED)

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
}
