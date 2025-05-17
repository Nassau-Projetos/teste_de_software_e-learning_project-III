import { PaginationParams } from '@/api/core/repositories/pagination-params'
import { Course } from '../../enterprise/entities/course'
import { CourseModule } from '../../enterprise/entities/courseModule'

export abstract class CoursesRepository {
	abstract findUnique(query: FindUniqueCourseQuery): Promise<Course | null>
	abstract findAllPublished(query: FindAllPublishedQuery): Promise<Course[]>
	abstract create(data: Course): Promise<Course>
	// abstract paginate(query?: PaginateCourseQuery): Promise< TODO: Terminar
	abstract update(
		courseId: string,
		data: UpdateCourseQuery,
	): Promise<Course | null>
	abstract remove(courseId: string): Promise<void>
}

abstract class FindUniqueCourseQuery {
	abstract courseId?: string
	abstract slug?: string
}

abstract class FindAllPublishedQuery {
	abstract paginate: PaginationParams
	abstract status: string
}

abstract class UpdateCourseQuery {
	title?: string
	description?: string
	thumbnailUrl?: string
	duration?: number
	modules?: CourseModule[]
	price?: number
	category?: string
	level?: string
}

abstract class PaginateCourseQuery {
	abstract paginate: PaginationParams
	abstract query?: {
		id?: string
		slug: string
	}
}
