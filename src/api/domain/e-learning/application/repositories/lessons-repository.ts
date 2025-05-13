import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Lesson } from '../../enterprise/entities/lesson'

export abstract class LessonsRepository {
	abstract findById(id: UniqueEntityId): Promise<Lesson | null>
	abstract findByModuleId(moduleId: UniqueEntityId): Promise<Lesson[]>
	abstract save(lesson: Lesson): Promise<void>
	abstract delete(id: UniqueEntityId): Promise<void>
}
