import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Student } from '../../enterprise/entities/student'

export abstract class StudentsRepository {
	abstract findById(id: UniqueEntityId): Promise<Student | null>
	abstract findByEmail(email: string): Promise<Student | null>
	abstract save(student: Student): Promise<void>
	abstract delete(id: UniqueEntityId): Promise<void>
}
