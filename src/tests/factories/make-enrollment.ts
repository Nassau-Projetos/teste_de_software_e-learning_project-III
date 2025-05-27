import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import {
	Enrollment,
	EnrollmentProps,
} from '@/api/domain/e-learning/enterprise/entities/enrollment'

export function makeEnrollment(
	override: Partial<EnrollmentProps> = {},
	id?: UniqueEntityId,
) {
	const enrollment = Enrollment.createPedingEnrollment(
		{
			studentId: override.studentId ?? new UniqueEntityId(),
			courseId: override.courseId ?? new UniqueEntityId(),
			...override,
		},
		id,
	)
	return enrollment
}
