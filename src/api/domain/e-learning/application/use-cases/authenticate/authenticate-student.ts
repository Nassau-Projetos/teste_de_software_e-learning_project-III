import { Either, left, right } from '@/api/core/either/either'
import { Encrypter } from '../../../cryptography/encrypter'
import { HashComparer } from '../../../cryptography/hash-comparer'
import { StudentsRepository } from '../../repositories/students-repository'
import { WrongCrenditialsError } from '../errors/wrong-credentials-error'

interface AuthenticateStudentUseCaseRequest {
	email: string
	password: string
}

type AuthenticateStudentUseCaseResponse = Either<
	WrongCrenditialsError,
	{
		accessToken: string
	}
>

export class AuthenticateStudentUseCase {
	constructor(
		private studentRepository: StudentsRepository,
		private hashComparer: HashComparer,
		private encrypter: Encrypter,
	) {}

	async execute({
		email,
		password,
	}: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
		const student = await this.studentRepository.findByEmail({ email })

		if (!student) {
			return left(new WrongCrenditialsError())
		}

		const isPasswordValid = await this.hashComparer.compare(
			password,
			student.passwordHash,
		)

		if (!isPasswordValid) {
			return left(new WrongCrenditialsError())
		}

		const accessToken = await this.encrypter.encrypt({
			sub: student.id.toString(),
		})

		return right({ accessToken })
	}
}
