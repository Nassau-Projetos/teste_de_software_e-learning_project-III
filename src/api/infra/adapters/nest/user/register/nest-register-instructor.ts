import { InstructorsRepository } from '@/api/domain/e-learning/application/repositories/instructors-repository'
import { RegisterInstructorUseCase } from '@/api/domain/e-learning/application/use-cases/user/register/register-instructor'
import { HashGenerator } from '@/api/domain/e-learning/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestRegisterInstructorUseCase extends RegisterInstructorUseCase {
	constructor(
		instructorRepository: InstructorsRepository,
		hashGenerator: HashGenerator,
	) {
		super(instructorRepository, hashGenerator)
	}
}
