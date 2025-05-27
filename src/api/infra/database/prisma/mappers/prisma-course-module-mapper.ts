import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { CourseModule } from '@/api/domain/e-learning/enterprise/entities/course-module'
import { Status } from '@/api/domain/e-learning/enterprise/entities/status'
import {
	Prisma,
	CourseModule as PrismaCourseModule,
	CourseStatus as PrismaCourseStatus,
} from '@prisma/client'

type PrismaCourseModuleWithStatus = PrismaCourseModule & {
	status: PrismaCourseStatus
}

export class PrismaCourseModuleMapper {
	static toDomain(
		persistenceCourseModule: PrismaCourseModuleWithStatus,
	): CourseModule {
		return CourseModule.create(
			{
				title: persistenceCourseModule.title,
				description: persistenceCourseModule.description ?? undefined,
				order: persistenceCourseModule.order,
				courseId: new UniqueEntityId(
					persistenceCourseModule.courseId ?? undefined,
				),
				status: Status.create({
					createdAt: persistenceCourseModule.status.createdAt,
				}),
				createdAt: persistenceCourseModule.createdAt,
				updatedAt: persistenceCourseModule.updatedAt ?? undefined,
				publishedAt: persistenceCourseModule.publishedAt ?? undefined,
			},
			new UniqueEntityId(persistenceCourseModule.id),
		)
	}

	static toPrisma(
		domainCourseModule: CourseModule,
	): Prisma.CourseModuleCreateInput {
		return {
			id: domainCourseModule.id.toString(),
			title: domainCourseModule.title,
			description: domainCourseModule.description ?? null,
			order: domainCourseModule.order,
			status: {
				connect: { id: domainCourseModule.status.id.toNumber() },
			},
			createdAt: domainCourseModule.createdAt,
			updatedAt: domainCourseModule.updatedAt ?? undefined,
			publishedAt: domainCourseModule.publishedAt ?? undefined,
			Course: {
				connect: { id: domainCourseModule.courseId.toString() },
			},
		}
	}
}
