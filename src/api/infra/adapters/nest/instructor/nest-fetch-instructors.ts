import { InstructorsRepository } from '@/api/domain/e-learning/application/repositories/instructors-repository'
import { FetchInstructorsUseCase } from '@/api/domain/e-learning/application/use-cases/instructor/fetch-instructors'

import { Injectable } from '@nestjs/common'

@Injectable()
export class NestFetchInstructorsUseCase extends FetchInstructorsUseCase {
	constructor(instructorRepository: InstructorsRepository) {
		super(instructorRepository)
	}
}
