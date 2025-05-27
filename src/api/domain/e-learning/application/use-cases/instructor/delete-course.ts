import { Either, left, right } from '@/api/core/either/either'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { CourseCategorysRepository } from '../../repositories/course-catogories-repository'
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
		private categoryRepository: CourseCategorysRepository,
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

		const category = await this.categoryRepository.findUnique({
			categoryId: course.category.id.toNumber(),
		})

		if (!category) {
			return left(new ResourceNotFoundError())
		}

		category.decrementCourseCount()
		instructor.removeCourse(course)

		await this.categoryRepository.save(category)
		await this.instructorRepository.save(instructor)
		await this.courseRepository.remove(course)

		return right(null)
	}
}
