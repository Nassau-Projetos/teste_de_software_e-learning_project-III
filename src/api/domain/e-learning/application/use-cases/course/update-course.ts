import { Either, left, right } from '@/api/core/either/either'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Course } from '../../../enterprise/entities/course'
import { CourseCategory } from '../../../enterprise/entities/value-objects/course/courseCategory'
import { CourseLevel } from '../../../enterprise/entities/value-objects/course/courseLevel'
import { Price } from '../../../enterprise/entities/value-objects/price'
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
		category?: string
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
		const {
			title,
			category,
			description,
			duration,
			level,
			price,
			thumbnailUrl,
		} = data
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
			if (price === 0) {
				course.makeFree()
			} else {
				course.changePrice(Price.create(price))
			}
		}

		if (level !== undefined) {
			course.changeLevel(CourseLevel.fromValue(level))
		}

		if (category !== undefined) {
			course.changeCategory(CourseCategory.fromValue(category))
		}

		await this.courseRepository.update(courseId, data)

		return right({ course })
	}
}
