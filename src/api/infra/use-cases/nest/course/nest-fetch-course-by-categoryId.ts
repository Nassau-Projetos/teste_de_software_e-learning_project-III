import { CourseCategorysRepository } from '@/api/domain/e-learning/application/repositories/course-catogories-repository'
import { CoursesRepository } from '@/api/domain/e-learning/application/repositories/courses-repository'
import { FetchCoursesByCategoryUseCase } from '@/api/domain/e-learning/application/use-cases/course/fetch-courses-by-category'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestFetchCourseByCategoryUseCase extends FetchCoursesByCategoryUseCase {
	constructor(
		courseRepository: CoursesRepository,
		categoryRepository: CourseCategorysRepository,
	) {
		super(courseRepository, categoryRepository)
	}
}
