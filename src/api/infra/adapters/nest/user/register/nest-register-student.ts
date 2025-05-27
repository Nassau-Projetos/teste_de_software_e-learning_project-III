import { StudentsRepository } from '@/api/domain/e-learning/application/repositories/students-repository'
import { RegisterStudentUseCase } from '@/api/domain/e-learning/application/use-cases/user/register/register-student'
import { HashGenerator } from '@/api/domain/e-learning/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestRegisterStudentUseCase extends RegisterStudentUseCase {
	constructor(
		studentRepository: StudentsRepository,
		hashGenerator: HashGenerator,
	) {
		super(studentRepository, hashGenerator)
	}
}
