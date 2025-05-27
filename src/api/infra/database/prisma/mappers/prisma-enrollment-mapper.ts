import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Enrollment } from '@/api/domain/e-learning/enterprise/entities/enrollment'
import { EnrollmentStatus } from '@/api/domain/e-learning/enterprise/entities/value-objects/enrollment/enrollment-status'
import {
	Prisma,
	Enrollment as PrismaEnrollment,
	EnrollmentStatus as PrismaEnrollmentStatus,
} from '@prisma/client'

export class PrismaEnrollmentMapper {
	static toDomain(persistenceEnrollment: PrismaEnrollment): Enrollment {
		return Enrollment.createPedingEnrollment({
			courseId: new UniqueEntityId(persistenceEnrollment.courseId),
			studentId: new UniqueEntityId(persistenceEnrollment.studentId),
			status: EnrollmentStatus.fromValue(persistenceEnrollment.status),
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
		const enrollmentStatusMap: Record<number, PrismaEnrollmentStatus> = {
			1: PrismaEnrollmentStatus.PENDING,
			2: PrismaEnrollmentStatus.ACTIVE,
			3: PrismaEnrollmentStatus.CANCELED,
			4: PrismaEnrollmentStatus.COMPLETED,
		}

		return {
			id: domainEnrollment.id.toString(),
			courseId: domainEnrollment.courseId.toString(),
			studentId: domainEnrollment.studentId.toString(),
			status: enrollmentStatusMap[domainEnrollment.status.value],
			progress: domainEnrollment.progress,
			enrolledAt: domainEnrollment.enrolledAt,
			requestAt: domainEnrollment.requestAt,
			canceledAt: domainEnrollment.canceledAt,
			completedAt: domainEnrollment.completedAt,
		}
	}
}
