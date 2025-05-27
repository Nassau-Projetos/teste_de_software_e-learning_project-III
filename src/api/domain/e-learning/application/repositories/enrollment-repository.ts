import { Enrollment } from '../../enterprise/entities/enrollment'

export abstract class EnrollmentsRepository {
	abstract findUnique(
		query: FindUniqueEnrollmentQuery,
	): Promise<Enrollment | null>
	abstract create(enrollment: Enrollment): Promise<void>
	abstract save(enrollment: Enrollment): Promise<void>
}

export abstract class FindUniqueEnrollmentQuery {
	abstract studentId?: string
	abstract enrollmentId?: string
}
