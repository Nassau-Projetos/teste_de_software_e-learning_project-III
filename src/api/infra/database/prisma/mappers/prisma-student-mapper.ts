import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Student } from '@/api/domain/e-learning/enterprise/entities/student'
import {
	Prisma,
	Student as PrismaStudent,
	User as PrismaUser,
} from '@prisma/client'

type PrismaStudentWithUser = PrismaStudent & { user: PrismaUser }

export class PrismaStudentMapper {
	static toDomain(persistenceStudent: PrismaStudentWithUser): Student {
		const { user } = persistenceStudent

		return Student.create(
			{
				email: user.email,
				passwordHash: user.password,
				avatarUrl: user.avatarUrl,
				name: persistenceStudent.name,
				cpf: persistenceStudent.cpf,
				phoneNumber: persistenceStudent.phoneNumber,
				enrollments: [],
			},
			new UniqueEntityId(persistenceStudent.id),
		)
	}

	static toPrisma(domainStudent: Student): Prisma.StudentCreateInput {
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
}
