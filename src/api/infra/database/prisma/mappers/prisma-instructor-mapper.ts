import { IncrementalEntityId } from '@/api/core/entities/value-objects/incremental-entity-id'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Course } from '@/api/domain/e-learning/enterprise/entities/course'
import { CourseCategory } from '@/api/domain/e-learning/enterprise/entities/course-category'
import { Instructor } from '@/api/domain/e-learning/enterprise/entities/instructor'
import { CourseLevel } from '@/api/domain/e-learning/enterprise/entities/value-objects/course/level'
import { Rating } from '@/api/domain/e-learning/enterprise/entities/value-objects/course/rating'
import { Discount } from '@/api/domain/e-learning/enterprise/entities/value-objects/price/discount'
import { Price } from '@/api/domain/e-learning/enterprise/entities/value-objects/price/price'
import { Slug } from '@/api/domain/e-learning/enterprise/entities/value-objects/slug/slug'
import { UserRole } from '@/api/domain/e-learning/enterprise/entities/value-objects/user/role'
import {
	Prisma,
	Course as PrismaCourse,
	CourseCategory as PrismaCourseCategory,
	Instructor as PrismaInstructor,
	User as PrismaUser,
	UserRole as PrismaUserRole,
} from '@prisma/client'

type PrismaInstructorWithUserAndCourses = PrismaInstructor & {
	user: PrismaUser
	courses: (PrismaCourse & {
		category: PrismaCourseCategory
	})[]
}

export class PrismaInstructorMapper {
	static toDomain(
		persistenceInstructor: PrismaInstructorWithUserAndCourses,
	): Instructor {
		const { user, courses } = persistenceInstructor

		return Instructor.create(
			{
				email: user.email,
				passwordHash: user.password,
				avatarUrl: user.avatarUrl,
				name: persistenceInstructor.name,
				bio: persistenceInstructor.bio,
				cpf: persistenceInstructor.cpf,
				role: UserRole.fromValue(user.role),
				phoneNumber: persistenceInstructor.phoneNumber,
				courses: courses.map((course) =>
					Course.create(
						{
							title: course.title,
							duration: course.duration,
							description: course.description,
							thumbnailUrl: course.thumbnailUrl,
							instructorId: new UniqueEntityId(course.instructorId),
							level: CourseLevel.fromValue(course.level),
							discount: course.discountPercentage
								? Discount.create({
										percentage: course.discountPercentage.toNumber(),
									})
								: null,
							rating: Rating.fromPrimitives(
								course.rating.toNumber(),
								course.ratingCount,
							),
							price: Price.create(course.priceAmount.toNumber()),
							modules: [],
							category: CourseCategory.create(
								{
									icon: course.category.icon,
									courseCount: course.category.courseCount,
									createdAt: course.category.createdAt,
									updatedAt: course.category.updatedAt,
								},
								new IncrementalEntityId(course.category.id),
							),
							slug: Slug.create(course.slug),
							studentsCount: course.studentsCount,
							createdAt: course.createdAt,
							updatedAt: course.updatedAt,
							publishedAt: course.publishedAt,
						},
						new UniqueEntityId(course.id),
					),
				),
			},
			new UniqueEntityId(persistenceInstructor.id),
		)
	}

	static toPrisma(domainInstructor: Instructor): Prisma.InstructorCreateInput {
		const roleKey = domainInstructor.role?.key ?? 'INSTRUCTOR'
		const role = PrismaUserRole[roleKey as keyof typeof PrismaUserRole]

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
					role,
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
			user: {
				update: {
					email: domainInstructor.email,
					password: domainInstructor.passwordHash,
					avatarUrl: domainInstructor.avatarUrl ?? undefined,
					updatedAt: domainInstructor.updatedAt ?? undefined,
				},
			},
		}
	}
}
