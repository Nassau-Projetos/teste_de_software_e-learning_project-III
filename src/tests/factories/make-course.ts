import { IncrementalEntityId } from '@/api/core/entities/value-objects/incremental-entity-id'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { STATUS } from '@/api/core/enums/status'
import {
	Course,
	CourseProps,
} from '@/api/domain/e-learning/enterprise/entities/course'
import { CourseCategory } from '@/api/domain/e-learning/enterprise/entities/course-category'
import { Status } from '@/api/domain/e-learning/enterprise/entities/status'
import { CourseLevel } from '@/api/domain/e-learning/enterprise/entities/value-objects/course/level'
import { Price } from '@/api/domain/e-learning/enterprise/entities/value-objects/price/price'
import { Slug } from '@/api/domain/e-learning/enterprise/entities/value-objects/slug/slug'
import { faker } from '@faker-js/faker'

export function makeCourse(
	override: Partial<CourseProps> = {},
	id?: UniqueEntityId,
) {
	const category =
		override.category ??
		CourseCategory.create({
			icon: 'code',
			courseCount: 0,
			createdAt: override.createdAt ?? new Date(),
			updatedAt: override.updatedAt ?? null,
		})

	const course = Course.create(
		{
			title: override.title ?? faker.lorem.words(4),
			description: override.description ?? faker.lorem.paragraph(),
			slug: Slug.create('course-test'),
			thumbnailUrl: override.thumbnailUrl ?? faker.image.url(),
			duration: override.duration ?? faker.number.int({ min: 60, max: 600 }),
			studentsCount: override.studentsCount ?? 0,
			price:
				override.price ??
				Price.create(faker.number.int({ min: 10, max: 1000 })),
			discount: override.discount ?? null,
			rating: override.rating ?? undefined,
			ratingCount: override.ratingCount ?? 0,
			status:
				override.status ??
				Status.create({}, new IncrementalEntityId(STATUS.DRAFT)),
			instructorId: override.instructorId ?? new UniqueEntityId(),
			modules: override.modules ?? [],
			category,
			level: override.level ?? CourseLevel.BEGINNER,
			createdAt: override.createdAt ?? new Date(),
			updatedAt: override.updatedAt ?? null,
			publishedAt: override.publishedAt ?? null,
		},
		id,
	)

	return course
}
