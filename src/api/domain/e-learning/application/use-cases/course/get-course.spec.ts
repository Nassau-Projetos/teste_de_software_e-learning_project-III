import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { makeCourse } from '@/tests/factories/make-course'
import { makeInstructor } from '@/tests/factories/make-instructor'
import { InMemoryCoursesRepository } from '@/tests/repositories/in-memory-course-repository'
import { InMemoryInstructorsRepository } from '@/tests/repositories/in-memory-instructor-repository'
import { GetCourseUseCase } from './get-course'

describe('Get Course', () => {
	let coursesRepository: InMemoryCoursesRepository
	let instructorsRepository: InMemoryInstructorsRepository
	let sut: GetCourseUseCase

	beforeEach(() => {
		coursesRepository = new InMemoryCoursesRepository()
		instructorsRepository = new InMemoryInstructorsRepository()
		sut = new GetCourseUseCase(coursesRepository, instructorsRepository)
	})

	it('should return course and instructor name if found', async () => {
		const instructor = makeInstructor()
		instructorsRepository.create(instructor)

		const course = makeCourse({ instructorId: instructor.id })
		coursesRepository.create(course)

		const result = await sut.execute({ courseId: course.id.toString() })

		expect(result.isRight()).toBe(true)

		if (result.isRight()) {
			expect(result.value.course.id).toEqual(course.id)
			expect(result.value.instructorName).toBe(instructor.name)
		}
	})

	it('should return error if course is not found', async () => {
		const result = await sut.execute({ courseId: 'non-existent-id' })

		expect(result.isLeft()).toBe(true)
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError)
		}
	})

	it('should return error if instructor is not found', async () => {
		const course = makeCourse()
		coursesRepository.create(course)

		const result = await sut.execute({ courseId: course.id.toString() })

		expect(result.isLeft()).toBe(true)
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError)
		}
	})
})
