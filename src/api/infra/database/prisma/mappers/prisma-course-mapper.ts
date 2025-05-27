import { IncrementalEntityId } from '@/api/core/entities/value-objects/incremental-entity-id'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Course } from '@/api/domain/e-learning/enterprise/entities/course'
import { CourseCategory } from '@/api/domain/e-learning/enterprise/entities/course-category'
import { Status } from '@/api/domain/e-learning/enterprise/entities/status'
import { CourseLevel } from '@/api/domain/e-learning/enterprise/entities/value-objects/course/level'
import { Rating } from '@/api/domain/e-learning/enterprise/entities/value-objects/course/rating'
import { Discount } from '@/api/domain/e-learning/enterprise/entities/value-objects/price/discount'
import { Price } from '@/api/domain/e-learning/enterprise/entities/value-objects/price/price'
import { Slug } from '@/api/domain/e-learning/enterprise/entities/value-objects/slug/slug'
import {
	Prisma,
	Course as PrismaCourse,
	CourseCategory as PrismaCourseCategory,
	CourseLevel as PrismaCourseLevel,
	CourseStatus as PrismaCourseStatus,
} from '@prisma/client'

type PrismaCourseWithCategory = PrismaCourse & {
	category: PrismaCourseCategory
	status: PrismaCourseStatus
}

export class PrismaCourseMapper {
	static toDomain(persistenceCourse: PrismaCourseWithCategory): Course {
		return Course.create(
			{
				title: persistenceCourse.title,
				duration: persistenceCourse.duration,
				description: persistenceCourse.description,
				thumbnailUrl: persistenceCourse.thumbnailUrl,
				instructorId: new UniqueEntityId(persistenceCourse.instructorId),
				level: CourseLevel.fromValue(persistenceCourse.level),
				discount: persistenceCourse.discountPercentage
					? Discount.create({
							percentage: persistenceCourse.discountPercentage.toNumber(),
						})
					: null,
				rating: Rating.fromPrimitives(
					persistenceCourse.rating.toNumber(),
					persistenceCourse.ratingCount,
				),
				price: Price.create(persistenceCourse.priceAmount.toNumber()),
				modules: [],
				category: CourseCategory.create(
					{
						icon: persistenceCourse.category.icon,
						courseCount: persistenceCourse.category.courseCount,
						createdAt: persistenceCourse.category.createdAt,
						updatedAt: persistenceCourse.category.updatedAt,
					},
					new IncrementalEntityId(persistenceCourse.category.id),
				),
				status: Status.create(
					{
						createdAt: persistenceCourse.category.createdAt,
					},
					new IncrementalEntityId(persistenceCourse.status.id),
				),
				slug: Slug.create(persistenceCourse.slug),
				studentsCount: persistenceCourse.studentsCount,
				createdAt: persistenceCourse.createdAt,
				updatedAt: persistenceCourse.updatedAt,
				publishedAt: persistenceCourse.publishedAt,
			},
			new UniqueEntityId(persistenceCourse.id),
		)
	}

	static toPrismaCreate(domainCourse: Course): Prisma.CourseCreateInput {
		const levelMap: Record<number, PrismaCourseLevel> = {
			1: PrismaCourseLevel.BEGINNER,
			2: PrismaCourseLevel.INTERMEDIARY,
			3: PrismaCourseLevel.ADVANCED,
		}

		return {
			id: domainCourse.id.toString(),
			title: domainCourse.title,
			duration: domainCourse.duration,
			description: domainCourse.description,
			thumbnailUrl: domainCourse.thumbnailUrl,
			slug: domainCourse.slug.value,
			level: levelMap[domainCourse.level.value],
			priceAmount: domainCourse.price.value,
			priceCurrency: 'BRL',

			discountPercentage: domainCourse.discount?.percentage ?? null,
			discountExpiresAt: domainCourse.discount?.expiresAt ?? null,

			studentsCount: domainCourse.studentsCount,
			rating: domainCourse.rating.average,
			ratingCount: domainCourse.rating.count,

			createdAt: domainCourse.createdAt,
			updatedAt: domainCourse.updatedAt ?? undefined,
			publishedAt: domainCourse.publishedAt,

			instructor: {
				connect: { id: domainCourse.instructorId.toString() },
			},

			category: {
				connect: { id: domainCourse.category.id.toNumber() },
			},

			status: {
				connect: { id: domainCourse.status.id.toNumber() },
			},
		}
	}

	static toPrismaUpdate(domainCourse: Course): Prisma.CourseUpdateInput {
		const levelMap: Record<string, PrismaCourseLevel> = {
			1: PrismaCourseLevel.BEGINNER,
			2: PrismaCourseLevel.INTERMEDIARY,
			3: PrismaCourseLevel.ADVANCED,
		}

		return {
			title: domainCourse.title,
			duration: domainCourse.duration,
			description: domainCourse.description,
			thumbnailUrl: domainCourse.thumbnailUrl,
			slug: domainCourse.slug.value,
			level: levelMap[domainCourse.level.value],
			priceAmount: domainCourse.price.value,
			priceCurrency: 'BRL',

			discountPercentage: domainCourse.discount?.percentage ?? null,
			discountExpiresAt: domainCourse.discount?.expiresAt ?? null,

			studentsCount: domainCourse.studentsCount,
			rating: domainCourse.rating.average,
			ratingCount: domainCourse.rating.count,

			createdAt: domainCourse.createdAt,
			updatedAt: domainCourse.updatedAt ?? undefined,
			publishedAt: domainCourse.publishedAt,

			instructor: {
				connect: { id: domainCourse.instructorId.toString() },
			},

			category: {
				connect: { id: domainCourse.category.id.toNumber() },
			},

			status: {
				connect: { id: domainCourse.status.id.toNumber() },
			},
		}
	}
}
