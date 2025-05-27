import {
	EnrollmentsRepository,
	FindUniqueEnrollmentQuery,
} from '@/api/domain/e-learning/application/repositories/enrollment-repository'
import { Enrollment } from '@/api/domain/e-learning/enterprise/entities/enrollment'

export class InMemoryEnrollmentsRepository implements EnrollmentsRepository {
	public items: Enrollment[] = []

	async findUnique({
		studentId,
	}: FindUniqueEnrollmentQuery): Promise<Enrollment | null> {
		const enrollment = this.items.find(
			(item) => item.studentId.toString() === studentId,
		)

		return enrollment ?? null
	}

	async create(enrollment: Enrollment): Promise<void> {
		this.items.push(enrollment)
	}

	async save(enrollment: Enrollment): Promise<void> {
		const index = this.items.findIndex(
			(item) => item.id.toString() === enrollment.id.toString(),
		)

		if (index >= 0) {
			this.items[index] = enrollment
		}
	}
}
