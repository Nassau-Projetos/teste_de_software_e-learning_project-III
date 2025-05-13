import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Instructor } from '../../enterprise/entities/instructor'

export abstract class InstructorsRepository {
	abstract findById(id: UniqueEntityId): Promise<Instructor | null>
	abstract findByEmail(email: string): Promise<Instructor | null>
	abstract save(instructor: Instructor): Promise<void>
	abstract delete(id: UniqueEntityId): Promise<void>
}
