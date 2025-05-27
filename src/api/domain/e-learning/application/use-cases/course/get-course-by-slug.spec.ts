import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { makeCourse } from '@/tests/factories/make-course'
import { InMemoryCoursesRepository } from '@/tests/repositories/in-memory-course-repository'
import { Slug } from '../../../enterprise/entities/value-objects/slug/slug'
import { GetCourseBySlugUseCase } from './get-course-by-slug'

describe('Get course by slug', () => {
	let inMemoryCourseRepository: InMemoryCoursesRepository
	let sut: GetCourseBySlugUseCase

	beforeEach(() => {
		inMemoryCourseRepository = new InMemoryCoursesRepository()
		sut = new GetCourseBySlugUseCase(inMemoryCourseRepository)
	})

	it('should return course when found by slug', async () => {
		const course = makeCourse({ slug: Slug.create('course-test') })
		inMemoryCourseRepository.create(course)

		const result = await sut.execute({ slug: 'course-test' })

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.course.title).toEqual(course.title)
		}
	})

	it('should return ResourceNotFoundError when course not found', async () => {
		const result = await sut.execute({ slug: 'non-existent-slug' })

		expect(result.isLeft()).toBe(true)
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError)
		}
	})
})
