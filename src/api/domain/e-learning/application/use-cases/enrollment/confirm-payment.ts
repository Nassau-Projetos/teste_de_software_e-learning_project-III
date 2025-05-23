import { Either, left, right } from '@/api/core/either/either'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Enrollment } from '../../../enterprise/entities/enrollment'
import { EnrollmentsRepository } from '../../repositories/enrollment-repository'
import { PaymentsRepository } from '../../repositories/payments-repository'

interface ConfirmPaymentUseCaseRequest {
	enrollmentId: string
	paymentId: string
}

type ConfirmPaymentUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		enrollment: Enrollment
	}
>

export class ConfirmPaymentUseCase {
	constructor(
		private readonly paymentRepository: PaymentsRepository,
		private readonly enrollmentRepository: EnrollmentsRepository,
	) {}

	async execute({
		enrollmentId,
		paymentId,
	}: ConfirmPaymentUseCaseRequest): Promise<ConfirmPaymentUseCaseResponse> {
		const enrollment = await this.enrollmentRepository.findUnique({
			enrollmentId,
		})
		const payment = await this.paymentRepository.findUnique({ paymentId })

		if (!enrollment || !payment) {
			return left(new ResourceNotFoundError())
		}

		if (!enrollment.paymentId?.equals(payment.id)) {
			return left(new NotAllowedError())
		}

		if (!payment.status.isApproved()) {
			return left(new ResourceNotFoundError())
		}

		enrollment.markAsPaid(payment)

		await this.enrollmentRepository.save(enrollment)

		return right({ enrollment })
	}
}
