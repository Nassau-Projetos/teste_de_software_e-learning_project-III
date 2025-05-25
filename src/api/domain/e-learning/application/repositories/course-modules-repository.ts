import { CourseModule } from '../../enterprise/entities/course-module'

export abstract class CourseModulesRepository {
	abstract findById(id: string): Promise<CourseModule | null>
	abstract findByCourseId(courseId: string): Promise<CourseModule[]>
	abstract create(module: CourseModule): Promise<void>
	abstract save(module: CourseModule): Promise<void>
	abstract delete(id: string): Promise<void>
}
