import { Either, left, right } from '@/api/core/either/either'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { InstructorsRepository } from '../../repositories/instructors-repository'

interface DeleteInstructorUseCaseRequest {
	instructorId: string
}

type DeleteInstructorUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteInstructorUseCase {
	constructor(private instructorRepository: InstructorsRepository) {}

	async execute({
		instructorId,
	}: DeleteInstructorUseCaseRequest): Promise<DeleteInstructorUseCaseResponse> {
		const instructor = await this.instructorRepository.findUnique({
			instructorId,
		})

		if (!instructor) {
			return left(new ResourceNotFoundError())
		}

		await this.instructorRepository.remove(instructor)

		return right(null)
	}
}
