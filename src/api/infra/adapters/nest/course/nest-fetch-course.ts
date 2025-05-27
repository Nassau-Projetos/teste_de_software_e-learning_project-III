import { CourseStatusesRepository } from '@/api/domain/e-learning/application/repositories/course-status-repository'
import { CoursesRepository } from '@/api/domain/e-learning/application/repositories/courses-repository'
import { FetchCoursesUseCase } from '@/api/domain/e-learning/application/use-cases/course/fetch-course'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestFetchCourseUseCase extends FetchCoursesUseCase {
	constructor(
		courseRepository: CoursesRepository,
		courseStatusRepository: CourseStatusesRepository,
	) {
		super(courseRepository, courseStatusRepository)
	}
}
