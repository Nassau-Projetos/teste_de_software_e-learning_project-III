import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Quiz } from '../../enterprise/entities/quiz'

export abstract class QuizzesRepository {
	abstract findById(id: UniqueEntityId): Promise<Quiz | null>
	abstract findByModuleId(moduleId: UniqueEntityId): Promise<Quiz[]>
	abstract save(quiz: Quiz): Promise<void>
}
