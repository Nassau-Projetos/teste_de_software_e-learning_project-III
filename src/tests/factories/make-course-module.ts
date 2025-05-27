import { IncrementalEntityId } from '@/api/core/entities/value-objects/incremental-entity-id'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { STATUS } from '@/api/core/enums/status'
import { CourseModule } from '@/api/domain/e-learning/enterprise/entities/course-module'
import { Status } from '@/api/domain/e-learning/enterprise/entities/status'
import { faker } from '@faker-js/faker/.'

export function makeCourseModule(
	override: Partial<CourseModule> = {},
	id?: UniqueEntityId,
) {
	const coursemodule = CourseModule.create(
		{
			title: override.title ?? faker.lorem.words(3),
			description: override.description ?? faker.lorem.sentence(),
			order: override.order ?? faker.number.int({ min: 1, max: 10 }),
			courseId: override.courseId ?? new UniqueEntityId(),
			status:
				override.status ??
				Status.create({}, new IncrementalEntityId(STATUS.DRAFT)),
			quiz: override.quiz ?? undefined,
			lessons: override.lessons ?? [],
			createdAt: override.createdAt ?? new Date(),
			updatedAt: override.updatedAt,
			publishedAt: override.publishedAt,
		},
		id,
	)
	return coursemodule
}
