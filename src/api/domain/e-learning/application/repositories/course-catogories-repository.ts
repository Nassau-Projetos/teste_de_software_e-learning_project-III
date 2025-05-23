import { CourseCategory } from '../../enterprise/entities/course-category'

export abstract class CourseCategorysRepository {
	abstract findUnique(
		query: FindUniqueCourseCategoryQuery,
	): Promise<CourseCategory | null>
	abstract create(data: CourseCategory): Promise<CourseCategory>
	abstract update(
		categoryId: number,
		data: UpdateCourseCategoryOptions,
	): Promise<CourseCategory | null>
	abstract delete(categoryId: number): Promise<void>
}

abstract class FindUniqueCourseCategoryQuery {
	abstract categoryId?: number
	abstract name?: string
}

abstract class UpdateCourseCategoryOptions {
	abstract name?: string
	abstract icon?: string
	abstract courseCount?: number
}
