import { StudentsRepository } from '@/api/domain/e-learning/application/repositories/students-repository'
import { AuthenticateStudentUseCase } from '@/api/domain/e-learning/application/use-cases/authenticate/authenticate-student'
import { Encrypter } from '@/api/domain/e-learning/cryptography/encrypter'
import { HashComparer } from '@/api/domain/e-learning/cryptography/hash-comparer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestAuthenticateStudentUseCase extends AuthenticateStudentUseCase {
	constructor(
		studentRepository: StudentsRepository,
		hashComparer: HashComparer,
		encrypter: Encrypter,
	) {
		super(studentRepository, hashComparer, encrypter)
	}
}
