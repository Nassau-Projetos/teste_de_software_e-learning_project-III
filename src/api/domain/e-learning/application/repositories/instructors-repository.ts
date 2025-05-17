import { Course } from '../../enterprise/entities/course'
import { Instructor } from '../../enterprise/entities/instructor'

export abstract class InstructorsRepository {
	abstract findUnique(
		query: FindUniqueInstructorQuery,
	): Promise<Instructor | null>
	abstract create(instructor: Instructor): Promise<Instructor>
	abstract update(
		instructorId: string,
		data: UpdateInstructorOptions,
	): Promise<void>
	abstract remove(instructorId: string): Promise<void>
}

export abstract class FindUniqueInstructorQuery {
	abstract instructorId?: string
	abstract email?: string
}

export abstract class UpdateInstructorOptions {
	abstract name?: string
	abstract bio?: string
	abstract cpf?: string
	abstract courses?: Course[]
	abstract phoneNumber?: string
	abstract email?: string
	abstract password?: string
}
