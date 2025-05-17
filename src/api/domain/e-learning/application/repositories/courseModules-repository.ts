import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { CourseModule } from '../../enterprise/entities/courseModule'

export abstract class CourseModulesRepository {
	abstract findById(id: UniqueEntityId): Promise<CourseModule | null>
	abstract findByCourseId(courseId: UniqueEntityId): Promise<CourseModule[]>
	abstract create(module: CourseModule): Promise<void>
	abstract save(module: CourseModule): Promise<void>
	abstract delete(id: UniqueEntityId): Promise<void>
}
