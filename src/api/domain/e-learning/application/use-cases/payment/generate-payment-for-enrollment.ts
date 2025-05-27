import { Either, left, right } from '@/api/core/either/either'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Payment } from '../../../enterprise/entities/payment'
import { EnrollmentsRepository } from '../../repositories/enrollment-repository'
import { PaymentsRepository } from '../../repositories/payments-repository'

interface GeneratePaymentForEnrollmentUseCaseRequest {
	enrollmentId: string
}

type GeneratePaymentForEnrollmentUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		payment: Payment
	}
>

export class GeneratePaymentForEnrollmentUseCase {
	constructor(
		private readonly paymentRepository: PaymentsRepository,
		private readonly enrollmentRepository: EnrollmentsRepository,
	) {}

	async execute({
		enrollmentId,
	}: GeneratePaymentForEnrollmentUseCaseRequest): Promise<GeneratePaymentForEnrollmentUseCaseResponse> {
		const enrollment = await this.enrollmentRepository.findUnique({
			enrollmentId,
		})

		if (!enrollment) {
			return left(new ResourceNotFoundError())
		}

		const payment = Payment.create({
			enrollmentId: enrollment.id,
		})

		await this.paymentRepository.create(payment)

		return right({ payment })
	}
}
