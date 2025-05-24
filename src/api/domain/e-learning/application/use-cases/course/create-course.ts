import { Either, left, right } from '@/api/core/either/either'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Course } from '../../../enterprise/entities/course'
import { CourseLevel } from '../../../enterprise/entities/value-objects/course/level'
import { Price } from '../../../enterprise/entities/value-objects/price/price'
import { CourseCategorysRepository } from '../../repositories/course-catogories-repository'
import { CoursesRepository } from '../../repositories/courses-repository'
import { InstructorsRepository } from '../../repositories/instructors-repository'

interface CreateCourseUseCaseRequest {
	instructorId: string
	title: string
	description?: string | null
	thumbnailUrl: string
	duration: number
	price: number
	categoryId: number
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
		private categoryRepository: CourseCategorysRepository,
		private instructorRepository: InstructorsRepository,
	) {}

	async execute({
		title,
		description,
		thumbnailUrl,
		duration,
		price,
		instructorId,
		categoryId,
		level,
	}: CreateCourseUseCaseRequest): Promise<CreateCourseUseCaseResponse> {
		const instructor = await this.instructorRepository.findUnique({
			instructorId,
		})
		const category = await this.categoryRepository.findUnique({
			categoryId,
		})

		if (!instructor || !category) {
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
			category,
		})

		category.incrementCourseCount()
		instructor.addCourse(course)

		await this.categoryRepository.update(category.id.toNumber(), {
			courseCount: category.courseCount,
		})
		await this.instructorRepository.save(instructor)
		await this.courseRepository.create(course)

		return right({ course })
	}
}
