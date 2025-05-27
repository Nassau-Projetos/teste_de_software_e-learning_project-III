import { STATUS } from '@/api/core/enums/status'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { makeCourse } from '@/tests/factories/make-course'
import { makeCourseStatus } from '@/tests/factories/make-course-statuses'
import { InMemoryCoursesRepository } from '@/tests/repositories/in-memory-course-repository'
import { InMemoryCourseStatusesRepository } from '@/tests/repositories/in-memory-course-statuses-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchCoursesUseCase } from './fetch-course'

describe('Fetch Courses Use Case', () => {
	let inMemoryCoursesRepository: InMemoryCoursesRepository
	let inMemoryCourseStatusesRepository: InMemoryCourseStatusesRepository
	let sut: FetchCoursesUseCase

	beforeEach(() => {
		inMemoryCoursesRepository = new InMemoryCoursesRepository()
		inMemoryCourseStatusesRepository = new InMemoryCourseStatusesRepository()

		sut = new FetchCoursesUseCase(
			inMemoryCoursesRepository,
			inMemoryCourseStatusesRepository,
		)
	})

	it('should be able to fetch courses by status', async () => {
		const status = makeCourseStatus(STATUS.PUBLISHED)
		await inMemoryCourseStatusesRepository.create(status)

		const course1 = makeCourse({ status: status })
		const course2 = makeCourse({ status: status })
		await inMemoryCoursesRepository.create(course1)
		await inMemoryCoursesRepository.create(course2)

		const result = await sut.execute({
			page: 1,
			limit: 10,
			statusId: status.id.toNumber(),
		})

		if (result.isRight()) {
			expect(result.value.courses).toHaveLength(2)
			expect(result.value.courses[0].category.id.toNumber()).toBe(1)
			expect(result.value.courses[1].category.id.toNumber()).toBe(2)
		} else {
			throw new Error('Expected Right but got Left')
		}
	})

	it('should return error if status does not exist', async () => {
		const result = await sut.execute({
			page: 1,
			limit: 10,
			statusId: 999,
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should return paginated courses', async () => {
		const status = makeCourseStatus(STATUS.PUBLISHED)
		await inMemoryCourseStatusesRepository.create(status)

		for (let i = 0; i < 30; i++) {
			await inMemoryCoursesRepository.create(makeCourse({ status: status }))
		}

		const result = await sut.execute({
			page: 2,
			limit: 10,
			statusId: status.id.toNumber(),
		})

		if (result.isRight()) {
			expect(result.value.courses).toHaveLength(10)
		}
	})
})
