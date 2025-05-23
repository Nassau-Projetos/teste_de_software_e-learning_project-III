import { Either, left, right } from '@/api/core/either/either'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Course } from '../../../enterprise/entities/course'
import { CourseCategorysRepository } from '../../repositories/course-catogories-repository'
import { CoursesRepository } from '../../repositories/courses-repository'

interface UpdateCourseCategoryUseCaseRequest {
	courseId: string
	instructorId: string
	categoryId: number
}

type UpdateCourseCategoryUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		course: Course
	}
>

export class UpdateCourseCategoryUseCase {
	constructor(
		private courseRepository: CoursesRepository,
		private categoryRepository: CourseCategorysRepository,
	) {}

	async execute({
		courseId,
		instructorId,
		categoryId,
	}: UpdateCourseCategoryUseCaseRequest): Promise<UpdateCourseCategoryUseCaseResponse> {
		const course = await this.courseRepository.findUnique({ courseId })

		if (!course) {
			return left(new ResourceNotFoundError())
		}

		if (instructorId != course.instructorId.toString()) {
			return left(new NotAllowedError())
		}

		const currentCategoryId = course.category.id.toNumber()

		if (categoryId !== currentCategoryId) {
			const oldCategory = await this.categoryRepository.findUnique({
				categoryId: currentCategoryId,
			})
			const newCategory = await this.categoryRepository.findUnique({
				categoryId,
			})

			if (!oldCategory || !newCategory) {
				return left(new ResourceNotFoundError())
			}

			oldCategory.decrementCourseCount()
			newCategory.incrementCourseCount()

			await this.categoryRepository.update(oldCategory.id.toNumber(), {
				courseCount: oldCategory.courseCount,
			})

			await this.categoryRepository.update(newCategory.id.toNumber(), {
				courseCount: newCategory.courseCount,
			})

			course.changeCategory(newCategory)
		}

		await this.courseRepository.save(course)

		return right({ course })
	}
}
