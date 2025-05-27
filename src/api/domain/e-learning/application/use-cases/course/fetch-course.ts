import { Either, left, right } from '@/api/core/either/either'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Course } from '../../../enterprise/entities/course'
import { CourseStatusesRepository } from '../../repositories/course-status-repository'
import { CoursesRepository } from '../../repositories/courses-repository'
import { InvalidCategoryError } from '../errors/course-category/invalid-category-error'

interface FetchCoursesUseCaseRequest {
	page: number
	limit: number
	statusId: number
}

type FetchCoursesUseCaseResponse = Either<
	ResourceNotFoundError | InvalidCategoryError,
	{
		courses: Course[]
	}
>

export class FetchCoursesUseCase {
	constructor(
		private courseRepository: CoursesRepository,
		private courseStatusRepository: CourseStatusesRepository,
	) {}

	async execute({
		page,
		limit,
		statusId,
	}: FetchCoursesUseCaseRequest): Promise<FetchCoursesUseCaseResponse> {
		const courseStatus = await this.courseStatusRepository.findUnique({
			statusId,
		})

		if (!courseStatus) {
			return left(new ResourceNotFoundError())
		}

		const courses = await this.courseRepository.findManyRecent({
			params: { page, limit },
			statusId,
		})

		return right({ courses })
	}
}
