import { InstructorsRepository } from '@/api/domain/e-learning/application/repositories/instructors-repository'
import { AuthenticateInstructorUseCase } from '@/api/domain/e-learning/application/use-cases/authenticate/authenticate-instructor'
import { Encrypter } from '@/api/domain/e-learning/cryptography/encrypter'
import { HashComparer } from '@/api/domain/e-learning/cryptography/hash-comparer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestAuthenticateInstructorUseCase extends AuthenticateInstructorUseCase {
	constructor(
		instructorRepository: InstructorsRepository,
		hashComparer: HashComparer,
		encrypter: Encrypter,
	) {
		super(instructorRepository, hashComparer, encrypter)
	}
}
