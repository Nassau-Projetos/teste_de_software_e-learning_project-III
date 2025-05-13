import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Payment } from '../../enterprise/entities/payment'

export abstract class PaymentsRepository {
	abstract findByEnrollmentId(
		enrollmentId: UniqueEntityId,
	): Promise<Payment | null>
	abstract save(payment: Payment): Promise<void>
}
