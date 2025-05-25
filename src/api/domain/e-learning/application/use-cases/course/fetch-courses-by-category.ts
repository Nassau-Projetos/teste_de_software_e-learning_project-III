import { Either, left, right } from '@/api/core/either/either'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Course } from '../../../enterprise/entities/course'
import { CourseCategorysRepository } from '../../repositories/course-catogories-repository'
import { CoursesRepository } from '../../repositories/courses-repository'
import { InvalidCategoryError } from '../errors/course-category/invalid-category-error'

interface FetchCoursesByCategoryUseCaseRequest {
	page: number
	limit: number
	categoryId: number
}

type FetchCoursesByCategoryUseCaseResponse = Either<
	ResourceNotFoundError | InvalidCategoryError,
	{
		courses: Course[]
	}
>

export class FetchCoursesByCategoryUseCase {
	constructor(
		private courseRepository: CoursesRepository,
		private courseCategoryRepository: CourseCategorysRepository,
	) {}

	async execute({
		page,
		limit,
		categoryId,
	}: FetchCoursesByCategoryUseCaseRequest): Promise<FetchCoursesByCategoryUseCaseResponse> {
		const persistenceCategory = await this.courseCategoryRepository.findUnique({
			categoryId,
		})

		if (!persistenceCategory) {
			return left(new ResourceNotFoundError())
		}

		const courses = await this.courseRepository.findManyByCategoryId({
			params: { page, limit },
			categoryId,
		})

		return right({ courses })
	}
}
