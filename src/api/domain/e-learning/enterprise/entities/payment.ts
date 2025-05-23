import { Entity } from '@/api/core/entities/entity'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Optional } from '@/api/core/types/optional'
import { PaymentStatus } from './value-objects/payment/payment-status'

interface PaymentProps {
	enrollmentId: UniqueEntityId
	status: PaymentStatus
	externalTransactionId?: string | null
	createdAt: Date
	updatedAt?: Date | null
}

export class Payment extends Entity<PaymentProps> {
	get enrollmentId() {
		return this.props.enrollmentId
	}

	get status() {
		return this.props.status
	}

	get externalTransactionId() {
		return this.props.externalTransactionId
	}

	get createdAt() {
		return this.props.createdAt
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	private touch() {
		this.props.updatedAt = new Date()
	}

	markAsApproved(externalId: string) {
		this.props.status.isApproved()
		this.props.externalTransactionId = externalId
		this.touch()
	}

	markAsRejected() {
		this.props.status.isRejected()
		this.touch()
	}

	markAsCancelled() {
		this.props.status.isCancelled()
		this.touch()
	}

	static create(
		props: Optional<PaymentProps, 'createdAt' | 'status'>,
		id?: UniqueEntityId,
	) {
		return new Payment(
			{
				...props,
				status:
					props.status instanceof PaymentStatus
						? props.status
						: PaymentStatus.PENDING,
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? null,
			},
			id,
		)
	}
}
