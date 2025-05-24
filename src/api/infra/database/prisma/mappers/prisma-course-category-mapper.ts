import { IncrementalEntityId } from '@/api/core/entities/value-objects/incremental-entity-id'
import { CourseCategory } from '@/api/domain/e-learning/enterprise/entities/course-category'
import { Prisma, CourseCategory as PrismaCourseCategory } from '@prisma/client'

export class PrismaCourseCategoryMapper {
	static toDomain(
		persistenceCourseCategory: PrismaCourseCategory,
	): CourseCategory {
		return CourseCategory.create(
			{
				icon: persistenceCourseCategory.icon,
				courseCount: persistenceCourseCategory.courseCount,
				createdAt: persistenceCourseCategory.createdAt,
				updatedAt: persistenceCourseCategory.updatedAt,
			},
			new IncrementalEntityId(persistenceCourseCategory.id),
		)
	}

	static toPrisma(
		domainCourseCategory: CourseCategory,
	): Prisma.CourseCategoryUncheckedCreateInput {
		return {
			id: domainCourseCategory.id.toNumber(),
			name: domainCourseCategory.name,
			icon: domainCourseCategory.icon,
			courseCount: domainCourseCategory.courseCount,
			createdAt: domainCourseCategory.createdAt,
			updatedAt: domainCourseCategory.updatedAt ?? undefined,
		}
	}
}
