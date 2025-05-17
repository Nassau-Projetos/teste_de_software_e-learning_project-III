import { Student } from '../../enterprise/entities/student'

export abstract class StudentsRepository {
	abstract findUnique(query: FindUniqueStudentQuery): Promise<Student | null>
	abstract create(student: Student): Promise<Student>
	abstract update(studentId: string, data: UpdateStudentOptions): Promise<void>
	abstract remove(studentId: string): Promise<void>
}

abstract class FindUniqueStudentQuery {
	abstract studentId?: string
	abstract email?: string
}

abstract class UpdateStudentOptions {
	abstract name?: string
	abstract cpf?: string
	abstract phoneNumber?: string
	abstract email?: string
	abstract passwordHash?: string
}
