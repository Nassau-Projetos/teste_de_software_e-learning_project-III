import { Either, left, right } from '@/api/core/either/either'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { CoursesRepository } from '../../repositories/courses-repository'
import { InstructorsRepository } from '../../repositories/instructors-repository'

interface DeleteCourseUseCaseRequest {
	courseId: string
	instructorId: string
}

type DeleteCourseUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	null
>

export class DeleteCourseUseCase {
	constructor(
		private courseRepository: CoursesRepository,
		private instructorRepository: InstructorsRepository,
	) {}

	async execute({
		courseId,
		instructorId,
	}: DeleteCourseUseCaseRequest): Promise<DeleteCourseUseCaseResponse> {
		const course = await this.courseRepository.findUnique({ courseId })
		const instructor = await this.instructorRepository.findUnique({
			instructorId,
		})

		if (!instructor || !course) {
			return left(new ResourceNotFoundError())
		}

		if (!course.instructorId.equals(instructor.id)) {
			return left(new NotAllowedError())
		}

		instructor?.removeCourse(course.id)
		await this.instructorRepository.update(instructorId, {
			courses: instructor?.courses,
		})
		await this.courseRepository.remove(courseId)

		return right(null)
	}
}
