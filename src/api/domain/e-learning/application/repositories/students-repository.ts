import { Student } from '../../enterprise/entities/student'

export abstract class StudentsRepository {
	abstract findUnique(query: FindUniqueStudentQuery): Promise<Student | null>
	abstract findByEmail(query: FindUniqueStudentQuery): Promise<Student | null>
	abstract create(student: Student): Promise<void>
	abstract save(student: Student): Promise<void>
	abstract remove(student: Student): Promise<void>
}

export abstract class FindUniqueStudentQuery {
	abstract studentId?: string
	abstract email?: string
}
