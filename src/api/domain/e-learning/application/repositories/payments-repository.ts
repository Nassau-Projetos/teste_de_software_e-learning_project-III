import { Payment } from '../../enterprise/entities/payment'

export abstract class PaymentsRepository {
	abstract findUnique(query: FindUniquePaymentQuery): Promise<Payment | null>
	abstract create(payment: Payment): Promise<Payment>
	abstract save(payment: Payment): Promise<Payment>
}

abstract class FindUniquePaymentQuery {
	abstract paymentId?: string
	abstract studentId?: string
	abstract enrollmentId?: string
}
