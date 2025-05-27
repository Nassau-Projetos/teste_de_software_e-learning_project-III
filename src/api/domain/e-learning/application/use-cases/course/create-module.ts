import { Either, left, right } from '@/api/core/either/either'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { CourseModule } from '../../../enterprise/entities/course-module'
import { CourseModulesRepository } from '../../repositories/course-modules-repository'
import { CoursesRepository } from '../../repositories/courses-repository'

interface CreateCourseModuleUseCaseRequest {
	courseId: string
	data: {
		title: string
		description?: string
		order?: number
	}
}

type CreateCourseUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		module: CourseModule
	}
>

export class CreateCourseModuleUseCase {
	constructor(
		private courseModuleRepository: CourseModulesRepository,
		private courseRepository: CoursesRepository,
	) {}

	async execute({
		courseId,
		data,
	}: CreateCourseModuleUseCaseRequest): Promise<CreateCourseUseCaseResponse> {
		const course = await this.courseRepository.findUnique({ courseId })

		const { title, description, order } = data

		if (!course) {
			return left(new ResourceNotFoundError())
		}

		const nextOrder = order ?? course.modules.length

		const module = CourseModule.create({
			courseId: new UniqueEntityId(courseId),
			title,
			description,
			order: nextOrder,
		})

		course.addModule(module)

		await this.courseRepository.save(course)
		await this.courseModuleRepository.create(module)

		return right({ module })
	}
}
