import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Enrollment } from '@/api/domain/e-learning/enterprise/entities/enrollment'
import { Student } from '@/api/domain/e-learning/enterprise/entities/student'
import { EnrollmentStatus } from '@/api/domain/e-learning/enterprise/entities/value-objects/enrollment/enrollment-status'
import {
	Prisma,
	Enrollment as PrismaEnrollment,
	Student as PrismaStudent,
	User as PrismaUser,
} from '@prisma/client'

type PrismaStudentWithUserAndEnrollments = PrismaStudent & {
	user: PrismaUser
	enrollments: PrismaEnrollment[]
}

export class PrismaStudentMapper {
	static toDomain(
		persistenceStudent: PrismaStudentWithUserAndEnrollments,
	): Student {
		const { user, enrollments } = persistenceStudent

		return Student.create(
			{
				email: user.email,
				passwordHash: user.password,
				avatarUrl: user.avatarUrl,
				name: persistenceStudent.name,
				cpf: persistenceStudent.cpf,
				phoneNumber: persistenceStudent.phoneNumber,
				enrollments: enrollments.map((enrollment) =>
					Enrollment.createPedingEnrollment(
						{
							courseId: new UniqueEntityId(enrollment.courseId),
							studentId: new UniqueEntityId(enrollment.studentId),
							progress: enrollment.progress,
							status: EnrollmentStatus.fromValue(enrollment.status),
							requestAt: enrollment.requestAt,
							enrolledAt: enrollment.enrolledAt,
							canceledAt: enrollment.canceledAt,
							completedAt: enrollment.completedAt,
						},
						new UniqueEntityId(enrollment.id),
					),
				),
			},
			new UniqueEntityId(persistenceStudent.id),
		)
	}

	static toPrismaCreate(domainStudent: Student): Prisma.StudentCreateInput {
		return {
			id: domainStudent.id.toString(),
			name: domainStudent.name,
			cpf: domainStudent.cpf,
			phoneNumber: domainStudent.phoneNumber,
			createdAt: domainStudent.createdAt,
			updatedAt: domainStudent.updatedAt,
			user: {
				create: {
					id: domainStudent.id.toString(),
					email: domainStudent.email,
					password: domainStudent.passwordHash,
					avatarUrl: domainStudent.avatarUrl ?? undefined,
					createdAt: domainStudent.createdAt,
					updatedAt: domainStudent.updatedAt ?? undefined,
				},
			},
		}
	}

	static toPrismaUpdate(domainStudent: Student): Prisma.StudentUpdateInput {
		return {
			name: domainStudent.name,
			cpf: domainStudent.cpf,
			phoneNumber: domainStudent.phoneNumber,
			updatedAt: domainStudent.updatedAt,
			user: {
				update: {
					email: domainStudent.email,
					password: domainStudent.passwordHash,
					avatarUrl: domainStudent.avatarUrl ?? undefined,
					updatedAt: domainStudent.updatedAt ?? undefined,
				},
			},
		}
	}
}
