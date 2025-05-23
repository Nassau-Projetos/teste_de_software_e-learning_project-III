import { Either, left, right } from '@/api/core/either/either'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Instructor } from '../../../enterprise/entities/instructor'
import { InstructorsRepository } from '../../repositories/instructors-repository'

interface GetInstructorUseCaseRequest {
	instructorId?: string
}

type GetInstructorUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		instructor: Instructor
	}
>

export class GetInstructorUseCase {
	constructor(private instructorRepository: InstructorsRepository) {}

	async execute({
		instructorId,
	}: GetInstructorUseCaseRequest): Promise<GetInstructorUseCaseResponse> {
		const instructor = await this.instructorRepository.findUnique({
			instructorId,
		})

		if (!instructor) {
			return left(new ResourceNotFoundError())
		}

		return right({ instructor })
	}
}
