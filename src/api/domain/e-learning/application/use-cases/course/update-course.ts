import { Either, left, right } from '@/api/core/either/either'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Course } from '../../../enterprise/entities/course'
import { CourseLevel } from '../../../enterprise/entities/value-objects/course/level'
import { Price } from '../../../enterprise/entities/value-objects/price/price'
import { CoursesRepository } from '../../repositories/courses-repository'

interface UpdateCourseUseCaseRequest {
	courseId: string
	instructorId: string
	data: {
		title?: string
		description?: string
		thumbnailUrl?: string
		duration?: number
		price?: number
		level?: string
	}
}

type UpdateCourseUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		course: Course
	}
>

export class UpdateCourseUseCase {
	constructor(private courseRepository: CoursesRepository) {}

	async execute({
		courseId,
		instructorId,
		data,
	}: UpdateCourseUseCaseRequest): Promise<UpdateCourseUseCaseResponse> {
		const course = await this.courseRepository.findUnique({ courseId })

		const { title, description, duration, level, price, thumbnailUrl } = data

		if (!course) {
			return left(new ResourceNotFoundError())
		}

		if (instructorId != course.instructorId.toString()) {
			return left(new NotAllowedError())
		}

		course.updateDetails({
			title,
			description,
			duration,
			thumbnailUrl,
		})

		if (price !== undefined) {
			course.changePrice(price === 0 ? Price.free() : Price.create(price))
		}

		if (level !== undefined) {
			let normalizedLevel: string | number = level

			if (typeof level === 'string' && /^\d+$/.test(level)) {
				normalizedLevel = parseInt(level, 10)
			}

			course.changeLevel(CourseLevel.fromValue(normalizedLevel))
		}

		await this.courseRepository.save(course)

		return right({ course })
	}
}
