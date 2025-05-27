import { Either, left, right } from '@/api/core/either/either'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Student } from '../../../enterprise/entities/student'
import { StudentsRepository } from '../../repositories/students-repository'

interface GetStudentUseCaseRequest {
	studentId: string
}

type GetStudentUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		student: Student
	}
>

export class GetStudentUseCase {
	constructor(private studentRepository: StudentsRepository) {}

	async execute({
		studentId,
	}: GetStudentUseCaseRequest): Promise<GetStudentUseCaseResponse> {
		const student = await this.studentRepository.findUnique({
			studentId,
		})

		if (!student) {
			return left(new ResourceNotFoundError())
		}

		return right({ student })
	}
}
