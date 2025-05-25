import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Enrollment } from '@/api/domain/e-learning/enterprise/entities/enrollment'
import { Prisma, Enrollment as PrismaEnrollment } from '@prisma/client'

export class PrismaEnrollmentMapper {
	static toDomain(persistenceEnrollment: PrismaEnrollment): Enrollment {
		return Enrollment.createPedingEnrollment({
			courseId: new UniqueEntityId(persistenceEnrollment.courseId),
			studentId: new UniqueEntityId(persistenceEnrollment.studentId),
			progress: persistenceEnrollment.progress,
			enrolledAt: persistenceEnrollment.enrolledAt,
			requestAt: persistenceEnrollment.requestAt,
			canceledAt: persistenceEnrollment.canceledAt,
			completedAt: persistenceEnrollment.completedAt,
		})
	}

	static toPrisma(
		domainEnrollment: Enrollment,
	): Prisma.EnrollmentUncheckedCreateInput {
		return {
			id: domainEnrollment.id.toString(),
			courseId: domainEnrollment.courseId.toString(),
			studentId: domainEnrollment.studentId.toString(),
			progress: domainEnrollment.progress,
			enrolledAt: domainEnrollment.enrolledAt,
			requestAt: domainEnrollment.requestAt,
			canceledAt: domainEnrollment.canceledAt,
			completedAt: domainEnrollment.completedAt,
		}
	}
}
