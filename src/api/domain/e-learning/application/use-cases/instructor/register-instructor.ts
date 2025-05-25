import { Either, left, right } from '@/api/core/either/either'
import { HashGenerator } from '../../../cryptography/hash-generator'
import { Instructor } from '../../../enterprise/entities/instructor'
import { InstructorsRepository } from '../../repositories/instructors-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

interface RegisterInstructorUseCaseRequest {
	name: string
	bio?: string
	cpf: string
	phoneNumber?: string
	email: string
	passwordHash: string
}

type RegisterInstructorUseCaseResponse = Either<
	UserAlreadyExistsError,
	{
		instructor: Instructor
	}
>

export class RegisterInstructorUseCase {
	constructor(
		private instructorRepository: InstructorsRepository,
		private hashGenerator: HashGenerator,
	) {}

	async execute({
		name,
		bio,
		cpf,
		phoneNumber,
		email,
		passwordHash,
	}: RegisterInstructorUseCaseRequest): Promise<RegisterInstructorUseCaseResponse> {
		const instructorWithSameEmail = await this.instructorRepository.findByEmail(
			{
				email,
			},
		)

		if (instructorWithSameEmail) {
			return left(new UserAlreadyExistsError(email))
		}

		const hashedPassword = await this.hashGenerator.hash(passwordHash)

		const instructor = Instructor.create({
			name,
			bio,
			cpf,
			phoneNumber,
			email,
			passwordHash: hashedPassword,
		})

		await this.instructorRepository.create(instructor)

		return right({ instructor })
	}
}
