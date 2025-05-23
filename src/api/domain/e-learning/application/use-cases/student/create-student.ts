import { Either, right } from '@/api/core/either/either'
import { Student } from '../../../enterprise/entities/student'
import { StudentsRepository } from '../../repositories/students-repository'

interface CreateStudentUseCaseRequest {
	name: string
	cpf: string
	phoneNumber?: string
	email: string
	password: string
}

type CreateStudentUseCaseResponse = Either<
	null,
	{
		student: Student
	}
>

export class CreateStudentUseCase {
	constructor(private studentRepository: StudentsRepository) {}

	async execute({
		name,
		cpf,
		phoneNumber,
		email,
		password,
	}: CreateStudentUseCaseRequest): Promise<CreateStudentUseCaseResponse> {
		const student = Student.create({
			name,
			cpf,
			phoneNumber,
			email,
			passwordHash: password,
		})

		await this.studentRepository.create(student)

		return right({ student })
	}
}
