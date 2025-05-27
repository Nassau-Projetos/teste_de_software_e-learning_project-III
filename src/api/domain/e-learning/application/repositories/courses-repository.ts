import { PaginationParams } from '@/api/core/repositories/pagination-params'
import { Course } from '../../enterprise/entities/course'

export abstract class CoursesRepository {
	abstract findUnique(query: FindUniqueCourseQuery): Promise<Course | null>
	abstract findBySlug(query: FindUniqueCourseQuery): Promise<Course | null>
	abstract findManyByCategoryId(
		query: FindManyCourseByCategoryIdQuery,
	): Promise<Course[]>
	abstract findManyRecent(
		query: FindManyCourseByStatusIdQuery,
	): Promise<Course[]>
	abstract create(data: Course): Promise<Course>
	abstract save(course: Course): Promise<void>
	abstract remove(course: Course): Promise<void>
}

export abstract class FindUniqueCourseQuery {
	abstract courseId?: string
	abstract slug?: string
}

export abstract class FindManyCourseByCategoryIdQuery {
	abstract categoryId?: number
	abstract params?: PaginationParams
}

export abstract class FindManyCourseByStatusIdQuery {
	abstract statusId?: number
	abstract params?: PaginationParams
}
