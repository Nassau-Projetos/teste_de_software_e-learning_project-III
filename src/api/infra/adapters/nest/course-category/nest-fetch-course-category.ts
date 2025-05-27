import { CourseCategorysRepository } from '@/api/domain/e-learning/application/repositories/course-catogories-repository'
import { FetchCourseCategoriesUseCase } from '@/api/domain/e-learning/application/use-cases/course-category/fetch-course-categories'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestFetchCourseCategoryUseCase extends FetchCourseCategoriesUseCase {
	constructor(courseCategoryRepository: CourseCategorysRepository) {
		super(courseCategoryRepository)
	}
}
