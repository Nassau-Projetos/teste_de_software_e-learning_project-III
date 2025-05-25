import { Either, left, right } from '@/api/core/either/either'
import { Encrypter } from '../../../cryptography/encrypter'
import { HashComparer } from '../../../cryptography/hash-comparer'
import { InstructorsRepository } from '../../repositories/instructors-repository'
import { WrongCrenditialsError } from '../errors/wrong-credentials-error'

interface AuthenticateInstructorUseCaseRequest {
	email: string
	password: string
}

type AuthenticateInstructorUseCaseResponse = Either<
	WrongCrenditialsError,
	{
		accessToken: string
	}
>

export class AuthenticateInstructorUseCase {
	constructor(
		private instructorRepository: InstructorsRepository,
		private hashComparer: HashComparer,
		private encrypter: Encrypter,
	) {}

	async execute({
		email,
		password,
	}: AuthenticateInstructorUseCaseRequest): Promise<AuthenticateInstructorUseCaseResponse> {
		const instructor = await this.instructorRepository.findByEmail({ email })

		if (!instructor) {
			return left(new WrongCrenditialsError())
		}

		const isPasswordValid = await this.hashComparer.compare(
			password,
			instructor.passwordHash,
		)

		if (!isPasswordValid) {
			return left(new WrongCrenditialsError())
		}

		const accessToken = await this.encrypter.encrypt({
			sub: instructor.id.toString(),
		})

		return right({ accessToken })
	}
}
