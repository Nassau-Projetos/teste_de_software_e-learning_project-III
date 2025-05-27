import { makeCourseCategory } from '@/tests/factories/make-course-category'
import { InMemoryCourseCategorysRepository } from '@/tests/repositories/in-memory-course-category-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchCourseCategoriesUseCase } from './fetch-course-categories'

let inMemoryCourseCategoriesRepository: InMemoryCourseCategorysRepository

let sut: FetchCourseCategoriesUseCase

describe('Fetch Course Categories', () => {
	beforeEach(() => {
		inMemoryCourseCategoriesRepository = new InMemoryCourseCategorysRepository()
		sut = new FetchCourseCategoriesUseCase(inMemoryCourseCategoriesRepository)
	})

	it('should return a list of course categories on success', async () => {
		const category1 = makeCourseCategory({ courseCount: 10 })
		const category2 = makeCourseCategory({ courseCount: 5 }, 2)

		await inMemoryCourseCategoriesRepository.create(category1)
		await inMemoryCourseCategoriesRepository.create(category2)

		const result = await sut.execute({ page: 1, limit: 10 })

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.courseCategories).toHaveLength(2)
			expect(result.value.courseCategories[0].courseCount).toBe(10)
			expect(result.value.courseCategories[1].courseCount).toBe(5)
		}
	})

	it('should return empty array if no categories found', async () => {
		const result = await sut.execute({ page: 1, limit: 10 })

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.courseCategories).toHaveLength(0)
		}
	})
})
