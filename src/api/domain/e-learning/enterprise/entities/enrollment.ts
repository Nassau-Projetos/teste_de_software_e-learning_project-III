import { AggregateRoot } from '@/api/core/entities/aggregate-root'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { DomainEvents } from '@/api/core/events/domain-events'
import { Optional } from '@/api/core/types/optional'
import { EnrollmentActivedEvent } from '../events/enrollment-actived-event'
import { Payment } from './payment'
import { EnrollmentStatus } from './value-objects/enrollment/enrollment-status'
import { PaymentStatus } from './value-objects/payment/payment-status'

export interface EnrollmentProps {
	studentId: UniqueEntityId
	courseId: UniqueEntityId
	paymentId?: UniqueEntityId | null
	status: EnrollmentStatus
	progress: number
	requestAt: Date
	enrolledAt?: Date | null
	completedAt?: Date | null
	canceledAt?: Date | null
}

export class Enrollment extends AggregateRoot<EnrollmentProps> {
	get studentId() {
		return this.props.studentId
	}

	get courseId() {
		return this.props.courseId
	}

	get status() {
		return this.props.status
	}

	get progress() {
		return this.props.progress
	}

	get paymentId() {
		return this.props.paymentId
	}

	get requestAt() {
		return this.props.requestAt
	}

	get enrolledAt() {
		return this.props.enrolledAt
	}

	get completedAt() {
		return this.props.completedAt
	}

	get canceledAt() {
		return this.props.canceledAt
	}

	updateProgress(newProgress: number) {
		if (newProgress < 0 || newProgress > 100) {
			throw new Error('Progresso deve estar entre 0 e 100')
		}

		this.props.progress = newProgress

		if (newProgress === 100) {
			this.complete()
		}
	}

	markAsPaid(payment: Payment) {
		if (payment.status !== PaymentStatus.APPROVED) {
			throw new Error('Pagamento não aprovado.')
		}
		this.props.status = EnrollmentStatus.ACTIVE
		this.props.enrolledAt = new Date()

		this.addDomainEvent(
			new EnrollmentActivedEvent(this.studentId, this.courseId, this.id),
		)
		DomainEvents.markAggregateForDispatch(this)
	}

	cancel() {
		if (this.status !== EnrollmentStatus.ACTIVE) {
			throw new Error('A inscrição não está ativa')
		}

		this.props.status = EnrollmentStatus.CANCELLED
		this.props.canceledAt = new Date()
	}

	private complete() {
		if (this.status !== EnrollmentStatus.ACTIVE) {
			throw new Error('A inscrição não está ativa')
		}

		this.props.status = EnrollmentStatus.COMPLETED
		this.props.completedAt = new Date()
	}

	static createPedingEnrollment(
		props: Optional<
			EnrollmentProps,
			'status' | 'progress' | 'requestAt' | 'paymentId'
		>,
		id?: UniqueEntityId,
	) {
		return new Enrollment(
			{
				...props,
				status:
					props.status instanceof EnrollmentStatus
						? props.status
						: EnrollmentStatus.PENDING,
				progress: props.progress ?? 0,
				paymentId: props.paymentId ?? null,
				requestAt: props.requestAt ?? new Date(),
			},
			id,
		)
	}
}
