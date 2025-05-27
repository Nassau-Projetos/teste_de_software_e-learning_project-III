import { PaginationParams } from '@/api/core/repositories/pagination-params'
import { Instructor } from '../../enterprise/entities/instructor'

export abstract class InstructorsRepository {
	abstract findUnique(
		query: FindUniqueInstructorQuery,
	): Promise<Instructor | null>
	abstract findByEmail(
		query: FindUniqueInstructorQuery,
	): Promise<Instructor | null>
	abstract findMany(query: FindManyInstructorsQuery): Promise<Instructor[]>
	abstract create(instructor: Instructor): Promise<void>
	abstract save(instructor: Instructor): Promise<void>
	abstract remove(instructor: Instructor): Promise<void>
}

export abstract class FindUniqueInstructorQuery {
	abstract instructorId?: string
	abstract email?: string
}

export abstract class FindManyInstructorsQuery {
	abstract params?: PaginationParams
}
