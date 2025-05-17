import { Either, left, right } from '@/api/core/either/either'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Course } from '../../../enterprise/entities/course'
import { CourseCategory } from '../../../enterprise/entities/value-objects/course/courseCategory'
import { CourseLevel } from '../../../enterprise/entities/value-objects/course/courseLevel'
import { Price } from '../../../enterprise/entities/value-objects/price'
import { CoursesRepository } from '../../repositories/courses-repository'
import { InstructorsRepository } from '../../repositories/instructors-repository'

interface CreateCourseUseCaseRequest {
	instructorId: string
	title: string
	description?: string | null
	thumbnailUrl: string
	duration: number
	price: number
	category: string
	level: string
}

type CreateCourseUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		course: Course
	}
>

export class CreateCourseUseCase {
	constructor(
		private courseRepository: CoursesRepository,
		private instructorRepository: InstructorsRepository,
	) {}

	async execute({
		title,
		description,
		thumbnailUrl,
		duration,
		price,
		instructorId,
		category,
		level,
	}: CreateCourseUseCaseRequest): Promise<CreateCourseUseCaseResponse> {
		const instructor = await this.instructorRepository.findUnique({
			instructorId,
		})

		if (!instructor) {
			return left(new ResourceNotFoundError())
		}

		const course = Course.create({
			title,
			description: description ?? null,
			thumbnailUrl,
			duration,
			price: price > 0 ? Price.create(price) : Price.free(),
			instructorId: new UniqueEntityId(instructorId),
			modules: [],
			level: CourseLevel.fromValue(level),
			category: CourseCategory.fromValue(category),
		})

		instructor.addCourse(course)

		await this.instructorRepository.update(instructorId, { courses: [course] })
		await this.courseRepository.create(course)

		return right({ course })
	}
}
