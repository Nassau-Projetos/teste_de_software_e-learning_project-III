import { Either, left, right } from '@/api/core/either/either'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Course } from '../../../enterprise/entities/course'
import { CoursesRepository } from '../../repositories/courses-repository'
import { InstructorsRepository } from '../../repositories/instructors-repository'

interface ArchiveCourseUseCaseRequest {
	courseId: string
	instructorId: string
}

type ArchiveCourseUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		course: Course
	}
>

export class ArchiveCourseUseCase {
	constructor(
		private courseRepository: CoursesRepository,
		private instructorRepository: InstructorsRepository,
	) {}

	async execute({
		courseId,
		instructorId,
	}: ArchiveCourseUseCaseRequest): Promise<ArchiveCourseUseCaseResponse> {
		const instructor = await this.instructorRepository.findUnique({
			instructorId,
		})
		const course = await this.courseRepository.findUnique({
			courseId,
		})

		if (!instructor || !course) {
			return left(new ResourceNotFoundError())
		}

		if (!course.instructorId.equals(instructor.id)) {
			return left(new NotAllowedError())
		}

		course.archive()
		await this.courseRepository.save(course)

		return right({ course })
	}
}
