import { CoursesRepository } from '@/api/domain/e-learning/application/repositories/courses-repository'
import { InstructorsRepository } from '@/api/domain/e-learning/application/repositories/instructors-repository'
import { PublishCourseUseCase } from '@/api/domain/e-learning/application/use-cases/instructor/publish-course'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestPublishCourseUseCase extends PublishCourseUseCase {
	constructor(
		courseRepository: CoursesRepository,
		instructorRepository: InstructorsRepository,
	) {
		super(courseRepository, instructorRepository)
	}
}
