import { Either, left, right } from '@/api/core/either/either'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Instructor } from '../../../enterprise/entities/instructor'
import { InstructorsRepository } from '../../repositories/instructors-repository'

interface FetchInstructorsUseCaseRequest {
	page: number
	limit: number
}

type FetchInstructorsUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		instructors: Instructor[]
	}
>

export class FetchInstructorsUseCase {
	constructor(private instructorsRepository: InstructorsRepository) {}

	async execute({
		page,
		limit,
	}: FetchInstructorsUseCaseRequest): Promise<FetchInstructorsUseCaseResponse> {
		const instructors = await this.instructorsRepository.findMany({
			params: { page, limit },
		})

		if (!instructors) {
			return left(new ResourceNotFoundError())
		}

		return right({ instructors })
	}
}
