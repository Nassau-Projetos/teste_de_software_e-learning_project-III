import { Either, right } from '@/api/core/either/either'
import { Instructor } from '../../../enterprise/entities/instructor'
import { InstructorsRepository } from '../../repositories/instructors-repository'

interface CreateInstructorUseCaseRequest {
	name: string
	bio?: string
	cpf: string
	phoneNumber?: string
	email: string
	password: string
}

type CreateInstructorUseCaseResponse = Either<
	null,
	{
		instructor: Instructor
	}
>

export class CreateInstructorUseCase {
	constructor(private instructorRepository: InstructorsRepository) {}

	async execute({
		name,
		bio,
		cpf,
		phoneNumber,
		email,
		password,
	}: CreateInstructorUseCaseRequest): Promise<CreateInstructorUseCaseResponse> {
		const instructor = Instructor.create({
			name,
			bio,
			cpf,
			phoneNumber,
			email,
			passwordHash: password,
		})

		await this.instructorRepository.create(instructor)

		return right({ instructor })
	}
}
