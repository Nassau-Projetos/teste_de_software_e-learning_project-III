import { Either, left, right } from '@/api/core/either/either'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Instructor } from '../../../enterprise/entities/instructor'
import { InstructorsRepository } from '../../repositories/instructors-repository'

interface UpdateInstructorUseCaseRequest {
	instructorId: string
	data: {
		name?: string
		bio?: string
		cpf?: string
		phoneNumber?: string
		email?: string
		password?: string
	}
}

type UpdateInstructorUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		instructor: Instructor
	}
>

export class UpdateInstructorUseCase {
	constructor(private instructorRepository: InstructorsRepository) {}

	async execute({
		instructorId,
		data,
	}: UpdateInstructorUseCaseRequest): Promise<UpdateInstructorUseCaseResponse> {
		const instructor = await this.instructorRepository.findUnique({
			instructorId,
		})
		const { name, cpf, email, password, bio, phoneNumber } = data

		if (!instructor) {
			return left(new ResourceNotFoundError())
		}

		instructor.updateDetails({
			name,
			cpf,
			email,
			passwordHash: password,
			bio,
			phoneNumber,
		})

		await this.instructorRepository.save(instructor)

		return right({ instructor })
	}
}
