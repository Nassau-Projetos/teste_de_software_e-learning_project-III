import { Either, left, right } from '@/api/core/either/either'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { StudentsRepository } from '../../repositories/students-repository'

interface DeleteStudentUseCaseRequest {
	studentId: string
}

type DeleteStudentUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteStudentUseCase {
	constructor(private studentRepository: StudentsRepository) {}

	async execute({
		studentId,
	}: DeleteStudentUseCaseRequest): Promise<DeleteStudentUseCaseResponse> {
		const student = await this.studentRepository.findUnique({
			studentId,
		})

		if (!student) {
			return left(new ResourceNotFoundError())
		}

		await this.studentRepository.remove(student)

		return right(null)
	}
}
