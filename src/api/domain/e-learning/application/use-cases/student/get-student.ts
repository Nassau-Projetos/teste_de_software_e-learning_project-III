import { Either, left, right } from '@/api/core/either/either'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Student } from '../../../enterprise/entities/student'
import { StudentsRepository } from '../../repositories/students-repository'

interface GetStudentUseCaseRequest {
	email?: string
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
		email,
	}: GetStudentUseCaseRequest): Promise<GetStudentUseCaseResponse> {
		const student = await this.studentRepository.findUnique({
			email,
		})

		if (!student) {
			return left(new ResourceNotFoundError())
		}

		return right({ student })
	}
}
