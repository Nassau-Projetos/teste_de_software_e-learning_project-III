import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { makeCourse } from '@/tests/factories/make-course'
import { makeCourseCategory } from '@/tests/factories/make-course-category'
import { InMemoryCourseCategorysRepository } from '@/tests/repositories/in-memory-course-category-repository'
import { InMemoryCoursesRepository } from '@/tests/repositories/in-memory-course-repository'
import { FetchCoursesByCategoryUseCase } from './fetch-courses-by-category'

describe('FetchCoursesByCategoryUseCase', () => {
	let courseRepository: InMemoryCoursesRepository
	let courseCategoryRepository: InMemoryCourseCategorysRepository
	let sut: FetchCoursesByCategoryUseCase

	beforeEach(() => {
		courseRepository = new InMemoryCoursesRepository()
		courseCategoryRepository = new InMemoryCourseCategorysRepository()
		sut = new FetchCoursesByCategoryUseCase(
			courseRepository,
			courseCategoryRepository,
		)
	})

	it('should return courses when category exists', async () => {
		const category = makeCourseCategory({ icon: 'icon1' })
		await courseCategoryRepository.create(category)

		const course1 = makeCourse({ category: category })
		const course2 = makeCourse({ category: category })

		await courseRepository.create(course1)
		await courseRepository.create(course2)

		const result = await sut.execute({ page: 1, limit: 10, categoryId: 1 })

		if (result.isRight()) {
			expect(result.value.courses).toHaveLength(2)
			expect(result.value.courses[0].category.id.toNumber()).toBe(1)
			expect(result.value.courses[1].category.id.toNumber()).toBe(1)
		}
	})

	it('should return ResourceNotFoundError when category does not exist', async () => {
		const result = await sut.execute({ page: 1, limit: 10, categoryId: 999 })
		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
