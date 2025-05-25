import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Instructor } from '@/api/domain/e-learning/enterprise/entities/instructor'
import {
	Prisma,
	Instructor as PrismaInstructor,
	User as PrismaUser,
} from '@prisma/client'

type PrismaInstructorWithUser = PrismaInstructor & { user: PrismaUser }

export class PrismaInstructorMapper {
	static toDomain(persistenceInstructor: PrismaInstructorWithUser): Instructor {
		const { user } = persistenceInstructor

		return Instructor.create(
			{
				email: user.email,
				passwordHash: user.password,
				avatarUrl: user.avatarUrl,
				name: persistenceInstructor.name,
				bio: persistenceInstructor.bio,
				cpf: persistenceInstructor.cpf,
				phoneNumber: persistenceInstructor.phoneNumber,
				courses: [],
			},
			new UniqueEntityId(persistenceInstructor.id),
		)
	}

	static toPrisma(domainInstructor: Instructor): Prisma.InstructorCreateInput {
		return {
			id: domainInstructor.id.toString(),
			name: domainInstructor.name,
			bio: domainInstructor.bio,
			cpf: domainInstructor.cpf,
			phoneNumber: domainInstructor.phoneNumber,
			createdAt: domainInstructor.createdAt,
			updatedAt: domainInstructor.updatedAt,
			user: {
				create: {
					id: domainInstructor.id.toString(),
					email: domainInstructor.email,
					password: domainInstructor.passwordHash,
					avatarUrl: domainInstructor.avatarUrl ?? undefined,
					createdAt: domainInstructor.createdAt,
					updatedAt: domainInstructor.updatedAt ?? undefined,
				},
			},
		}
	}

	static toPrismaUpdate(
		domainInstructor: Instructor,
	): Prisma.InstructorUpdateInput {
		return {
			name: domainInstructor.name,
			bio: domainInstructor.bio,
			cpf: domainInstructor.cpf,
			phoneNumber: domainInstructor.phoneNumber,
			updatedAt: domainInstructor.updatedAt,
		}
	}
}
