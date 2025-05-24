import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { CourseModule } from '@/api/domain/e-learning/enterprise/entities/course-module'
import {
	Prisma,
	CourseModule as PrismaCourseModule,
	CourseStatus as PrismaCourseStatus,
} from '@prisma/client'

export class PrismaCourseModuleMapper {
	static toDomain(persistenceCourseModule: PrismaCourseModule): CourseModule {
		return CourseModule.create(
			{
				title: persistenceCourseModule.title,
				description: persistenceCourseModule.description ?? undefined,
				order: persistenceCourseModule.order,
				courseId: new UniqueEntityId(
					persistenceCourseModule.courseId ?? undefined,
				),
				createdAt: persistenceCourseModule.createdAt,
				updatedAt: persistenceCourseModule.updatedAt ?? undefined,
				publishedAt: persistenceCourseModule.publishedAt ?? undefined,
			},
			new UniqueEntityId(persistenceCourseModule.id),
		)
	}

	static toPrisma(
		domainCourseModule: CourseModule,
	): Prisma.CourseModuleUncheckedCreateInput {
		const statusMap: Record<number, PrismaCourseStatus> = {
			1: PrismaCourseStatus.DRAFT,
			2: PrismaCourseStatus.PUBLISHED,
			3: PrismaCourseStatus.ARCHIVED,
		}

		return {
			id: domainCourseModule.id.toString(),
			title: domainCourseModule.title,
			description: domainCourseModule.description ?? null,
			order: domainCourseModule.order,
			status: statusMap[domainCourseModule.status.value],
			courseId: domainCourseModule.courseId.toString(),
			createdAt: domainCourseModule.createdAt,
			updatedAt: domainCourseModule.updatedAt ?? undefined,
			publishedAt: domainCourseModule.publishedAt ?? undefined,
		}
	}
}
