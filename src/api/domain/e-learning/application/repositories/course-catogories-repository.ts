import { Value } from '@prisma/client/runtime/library'
import { CourseCategory } from '../../enterprise/entities/course-category'

export abstract class CourseCategorysRepository {
	abstract findUnique(
		query: FindUniqueCourseCategoryQuery,
	): Promise<CourseCategory | null>
	abstract create(data: CourseCategory): Promise<CourseCategory>
	abstract update(
		categoryId: Number,
		data: UpdateCourseCategoryOptions,
	): Promise<CourseCategory | null>
	abstract delete(categoryId: Number): Promise<void>
}

export abstract class FindUniqueCourseCategoryQuery {
	abstract categoryId?: Number
	abstract name?: string
}

export abstract class UpdateCourseCategoryOptions {
	abstract name?: string
	abstract icon?: string
	abstract courseCount?: Number
}
