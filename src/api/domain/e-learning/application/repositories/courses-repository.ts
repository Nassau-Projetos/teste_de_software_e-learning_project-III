import { Course } from '../../enterprise/entities/course'
import { CourseModule } from '../../enterprise/entities/course-module'

export abstract class CoursesRepository {
	abstract findUnique(query: FindUniqueCourseQuery): Promise<Course | null>
	abstract findMany(): Promise<Course[]>
	abstract create(data: Course): Promise<void>
	abstract save(course: Course): Promise<void>
	abstract remove(course: Course): Promise<void>
}

export abstract class FindUniqueCourseQuery {
	abstract courseId?: string
	abstract slug?: string
}

export abstract class UpdateCourseOptions {
	title?: string
	description?: string | null
	thumbnailUrl?: string
	duration?: number
	modules?: CourseModule[]
	price?: number
	category?: string
	level?: string
}
