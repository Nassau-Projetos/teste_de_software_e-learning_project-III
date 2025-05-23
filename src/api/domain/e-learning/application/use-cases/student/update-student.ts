import { Either, left, right } from '@/api/core/either/either'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Student } from '../../../enterprise/entities/student'
import { StudentsRepository } from '../../repositories/students-repository'

interface UpdateStudentUseCaseRequest {
	studentId: string
	data: {
		name?: string
		cpf?: string
		phoneNumber?: string
		email?: string
		password?: string
	}
}

type UpdateStudentUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		student: Student
	}
>

export class UpdateStudentUseCase {
	constructor(private studentRepository: StudentsRepository) {}

	async execute({
		studentId,
		data,
	}: UpdateStudentUseCaseRequest): Promise<UpdateStudentUseCaseResponse> {
		const student = await this.studentRepository.findUnique({
			studentId,
		})
		const { name, cpf, email, password, phoneNumber } = data

		if (!student) {
			return left(new ResourceNotFoundError())
		}

		student.updateDetails({
			name,
			cpf,
			email,
			passwordHash: password,
			phoneNumber,
		})

		await this.studentRepository.save(student)

		return right({ student })
	}
}
