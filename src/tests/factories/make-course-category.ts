import { IncrementalEntityId } from '@/api/core/entities/value-objects/incremental-entity-id'
import { CATEGORY } from '@/api/core/enums/category'
import {
	CourseCategory,
	CourseCategoryProps,
} from '@/api/domain/e-learning/enterprise/entities/course-category'

export function makeCourseCategory(
	override: Partial<CourseCategoryProps> = {},
	categoryId: CATEGORY = CATEGORY.DESENVOLVIMENTO_WEB,
) {
	const coursecategory = CourseCategory.create(
		{
			icon: override.icon ?? 'default-icon',
			courseCount: override.courseCount ?? 0,
			createdAt: override.createdAt ?? new Date(),
			updatedAt: override.updatedAt ?? null,
		},
		new IncrementalEntityId(categoryId),
	)
	return coursecategory
}
