import { AggregateRoot } from '@/api/core/entities/aggregate-root'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Optional } from '@/api/core/types/optional'
import { Payment } from './payment'
import { EnrollmentStatus } from './value-objects/enrollment/enrollment-status'
import { PaymentStatus } from './value-objects/payment/payment-status'

interface EnrollmentProps {
	studentId: UniqueEntityId
	courseId: UniqueEntityId
	status: EnrollmentStatus
	progress: number
	enrolledAt: Date
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
	}

	cancel() {
		if (this.status !== EnrollmentStatus.ACTIVE) {
			throw new Error('A inscrição não está ativa')
		}

		this.props.status = EnrollmentStatus.CANCELLED
		this.props.canceledAt = new Date()
	}

	complete() {
		if (this.status !== EnrollmentStatus.ACTIVE) {
			throw new Error('A inscrição não está ativa')
		}

		this.props.status = EnrollmentStatus.COMPLETED
		this.props.completedAt = new Date()
	}

	static create(
		props: Optional<EnrollmentProps, 'status' | 'progress' | 'enrolledAt'>,
		id?: UniqueEntityId,
	) {
		return new Enrollment(
			{
				...props,
				status:
					props.status instanceof EnrollmentStatus
						? props.status
						: EnrollmentStatus.ACTIVE,
				progress: props.progress ?? 0,
				enrolledAt: props.enrolledAt ?? new Date(),
			},
			id,
		)
	}
}
