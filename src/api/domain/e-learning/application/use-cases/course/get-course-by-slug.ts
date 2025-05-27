import { Either, left, right } from '@/api/core/either/either'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Course } from '../../../enterprise/entities/course'
import { CoursesRepository } from '../../repositories/courses-repository'

interface GetCourseBySlugUseCaseRequest {
	slug: string
}

type GetCourseBySlugUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		course: Course
	}
>

export class GetCourseBySlugUseCase {
	constructor(private courseRepository: CoursesRepository) {}

	async execute({
		slug,
	}: GetCourseBySlugUseCaseRequest): Promise<GetCourseBySlugUseCaseResponse> {
		const course = await this.courseRepository.findBySlug({ slug })

		if (!course) {
			return left(new ResourceNotFoundError())
		}

		return right({ course })
	}
}
