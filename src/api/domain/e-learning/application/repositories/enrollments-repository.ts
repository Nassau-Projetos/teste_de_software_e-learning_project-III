import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Enrollment } from '../../enterprise/entities/enrollment'

export abstract class EnrollmentsRepository {
	abstract findByStudentAndCourse(
		studentId: UniqueEntityId,
		courseId: UniqueEntityId,
	): Promise<Enrollment | null>
	abstract save(enrollment: Enrollment): Promise<void>
	abstract delete(id: UniqueEntityId): Promise<void>
}
