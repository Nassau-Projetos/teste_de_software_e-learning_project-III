import { InstructorsRepository } from '@/api/domain/e-learning/application/repositories/instructors-repository'
import { GetInstructorUseCase } from '@/api/domain/e-learning/application/use-cases/instructor/get-instructor'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestGetInstructorUseCase extends GetInstructorUseCase {
	constructor(instructorRepository: InstructorsRepository) {
		super(instructorRepository)
	}
}
