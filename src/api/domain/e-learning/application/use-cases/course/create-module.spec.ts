import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { makeCourse } from '@/tests/factories/make-course'
import { InMemoryCourseModulesRepository } from '@/tests/repositories/in-memory-course-module-repository'
import { InMemoryCoursesRepository } from '@/tests/repositories/in-memory-course-repository'
import { CreateCourseModuleUseCase } from './create-module'

describe('Create Course Module', () => {
	let inMemoryCourseModuleRepository: InMemoryCourseModulesRepository
	let inMemoryCourseRepository: InMemoryCoursesRepository
	let sut: CreateCourseModuleUseCase

	beforeEach(() => {
		inMemoryCourseRepository = new InMemoryCoursesRepository()
		inMemoryCourseModuleRepository = new InMemoryCourseModulesRepository()

		sut = new CreateCourseModuleUseCase(
			inMemoryCourseModuleRepository,
			inMemoryCourseRepository,
		)
	})

	it('should be able to create an course module', async () => {
		const course = makeCourse()
		await inMemoryCourseRepository.create(course)

		const result = await sut.execute({
			courseId: course.id.toString(),
			data: { title: 'Introduction to DDD' },
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryCourseModuleRepository.items).toHaveLength(1)
		expect(inMemoryCourseModuleRepository.items[0].title).toBe(
			'Introduction to DDD',
		)
		expect(inMemoryCourseModuleRepository.items[0].courseId.toString()).toBe(
			course.id.toString(),
		)
	})

	it('should not be able to create a module for a non-existing course', async () => {
		const result = await sut.execute({
			courseId: 'non-existent-course-id',
			data: { title: 'Ghost Module' },
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
