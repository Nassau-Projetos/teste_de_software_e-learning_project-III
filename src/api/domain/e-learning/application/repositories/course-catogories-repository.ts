import { PaginationParams } from '@/api/core/repositories/pagination-params'
import { CourseCategory } from '../../enterprise/entities/course-category'

export abstract class CourseCategorysRepository {
	abstract findUnique(
		query: FindUniqueCourseCategoryQuery,
	): Promise<CourseCategory | null>
	abstract findByName(params: { name: string }): Promise<CourseCategory | null>
	abstract findMany(
		query: FindManyCourseCategoriesQuery,
	): Promise<CourseCategory[]>
	abstract create(data: CourseCategory): Promise<CourseCategory>
	abstract save(courseCategory: CourseCategory): Promise<void>
	abstract delete(categoryId: number): Promise<void>
}

export abstract class FindUniqueCourseCategoryQuery {
	abstract categoryId?: number
	abstract name?: string
}

export abstract class FindManyCourseCategoriesQuery {
	abstract params?: PaginationParams
}
