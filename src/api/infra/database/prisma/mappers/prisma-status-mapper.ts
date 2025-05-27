import { IncrementalEntityId } from '@/api/core/entities/value-objects/incremental-entity-id'
import { Status } from '@/api/domain/e-learning/enterprise/entities/status'
import { Prisma, CourseStatus as PrismaCourseStatus } from '@prisma/client'

export class PrismaCourseStatusMapper {
	static toDomain(persistenceCourseStatus: PrismaCourseStatus): Status {
		return Status.create(
			{
				createdAt: persistenceCourseStatus.createdAt,
			},
			new IncrementalEntityId(persistenceCourseStatus.id),
		)
	}

	static toPrisma(
		domainCourseStatus: Status,
	): Prisma.CourseStatusUncheckedCreateInput {
		return {
			id: domainCourseStatus.id.toNumber(),
			name: domainCourseStatus.name,
			createdAt: domainCourseStatus.createdAt,
		}
	}
}
