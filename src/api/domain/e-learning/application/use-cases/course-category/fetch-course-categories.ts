import { Either, left, right } from '@/api/core/either/either'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { CourseCategory } from '../../../enterprise/entities/course-category'
import { CourseCategorysRepository } from '../../repositories/course-catogories-repository'
import { InvalidCategoryError } from '../errors/course-category/invalid-category-error'

interface FetchCourseCategoriesUseCaseRequest {
	page: number
	limit: number
}

type FetchCourseCategoriesUseCaseResponse = Either<
	ResourceNotFoundError | InvalidCategoryError,
	{
		courseCategories: CourseCategory[]
	}
>

export class FetchCourseCategoriesUseCase {
	constructor(private courseCategoriesRepository: CourseCategorysRepository) {}

	async execute({
		page,
		limit,
	}: FetchCourseCategoriesUseCaseRequest): Promise<FetchCourseCategoriesUseCaseResponse> {
		const courseCategories = await this.courseCategoriesRepository.findMany({
			params: { page, limit },
		})

		if (!courseCategories) {
			return left(new ResourceNotFoundError())
		}

		return right({ courseCategories })
	}
}
