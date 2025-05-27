import { Either, left, right } from '@/api/core/either/either'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Course } from '../../../enterprise/entities/course'
import { CoursesRepository } from '../../repositories/courses-repository'
import { InstructorsRepository } from '../../repositories/instructors-repository'

interface GetCourseUseCaseRequest {
	courseId: string
}

type GetCourseUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		course: Course
		instructorName: string
	}
>

export class GetCourseUseCase {
	constructor(
		private courseRepository: CoursesRepository,
		private instructorRepository: InstructorsRepository,
	) {}

	async execute({
		courseId,
	}: GetCourseUseCaseRequest): Promise<GetCourseUseCaseResponse> {
		const course = await this.courseRepository.findUnique({ courseId })

		if (!course) {
			return left(new ResourceNotFoundError())
		}

		const instructor = await this.instructorRepository.findUnique({
			instructorId: course.instructorId.toString(),
		})

		if (!instructor) {
			return left(new ResourceNotFoundError())
		}

		return right({ course, instructorName: instructor.name })
	}
}
