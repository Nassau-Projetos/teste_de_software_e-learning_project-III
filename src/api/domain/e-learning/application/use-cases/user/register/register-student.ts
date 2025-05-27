import { Either, left, right } from '@/api/core/either/either'
import { HashGenerator } from '@/api/domain/e-learning/cryptography/hash-generator'
import { Student } from '@/api/domain/e-learning/enterprise/entities/student'
import { StudentsRepository } from '../../../repositories/students-repository'
import { UserAlreadyExistsError } from '../../errors/user-already-exists-error'

interface RegisterStudentUseCaseRequest {
	name: string
	cpf: string
	phoneNumber?: string
	email: string
	password: string
}

type RegisterStudentUseCaseResponse = Either<
	UserAlreadyExistsError,
	{
		student: Student
	}
>

export class RegisterStudentUseCase {
	constructor(
		private studentRepository: StudentsRepository,
		private hashGenerator: HashGenerator,
	) {}

	async execute({
		name,
		cpf,
		phoneNumber,
		email,
		password,
	}: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
		const studentWithSameEmail = await this.studentRepository.findByEmail({
			email,
		})

		if (studentWithSameEmail) {
			return left(new UserAlreadyExistsError(email))
		}

		const hashedPassword = await this.hashGenerator.hash(password)

		const student = Student.create({
			name,
			cpf,
			phoneNumber,
			email,
			passwordHash: hashedPassword,
		})

		await this.studentRepository.create(student)

		return right({ student })
	}
}
