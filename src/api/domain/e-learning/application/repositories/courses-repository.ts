import { PaginationParams } from '@/api/core/repositories/pagination-params'
import { Course } from '../../enterprise/entities/course'

export abstract class CoursesRepositorys {
	abstract findById(id: string): Promise<Course | null>
	abstract findBySlug(slug: string): Promise<Course | null>
	abstract findAllPublished(params: PaginationParams): Promise<Course[]>
	abstract create(course: Course): Promise<void>
	abstract save(course: Course): Promise<void>
	abstract delete(course: Course): Promise<void>
}
