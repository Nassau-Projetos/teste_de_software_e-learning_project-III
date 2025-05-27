import { CoursesRepository } from '@/api/domain/e-learning/application/repositories/courses-repository'
import { InstructorsRepository } from '@/api/domain/e-learning/application/repositories/instructors-repository'
import { GetCourseUseCase } from '@/api/domain/e-learning/application/use-cases/course/get-course'

import { Injectable } from '@nestjs/common'

@Injectable()
export class NestGetCourseUseCase extends GetCourseUseCase {
	constructor(
		courseRepository: CoursesRepository,
		instructorRepository: InstructorsRepository,
	) {
		super(courseRepository, instructorRepository)
	}
}
