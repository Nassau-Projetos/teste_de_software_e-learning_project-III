import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { makeCourse } from '@/tests/factories/make-course'
import { makeInstructor } from '@/tests/factories/make-instructor'
import { InMemoryCoursesRepository } from '@/tests/repositories/in-memory-course-repository'
import { InMemoryInstructorsRepository } from '@/tests/repositories/in-memory-instructor-repository'
import { PublishCourseUseCase } from './publish-course'

describe('Publish Course', () => {
	let coursesRepository: InMemoryCoursesRepository
	let instructorsRepository: InMemoryInstructorsRepository
	let sut: PublishCourseUseCase

	beforeEach(() => {
		coursesRepository = new InMemoryCoursesRepository()
		instructorsRepository = new InMemoryInstructorsRepository()
		sut = new PublishCourseUseCase(coursesRepository, instructorsRepository)
	})

	it('should publish course if instructor is owner', async () => {
		const instructor = makeInstructor()
		const course = makeCourse({ instructorId: instructor.id })

		instructorsRepository.create(instructor)
		coursesRepository.create(course)

		const result = await sut.execute({
			courseId: course.id.toString(),
			instructorId: instructor.id.toString(),
		})

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.course.status.isPublished()).toBe(true)
		}
	})

	it('should return NotAllowedError if instructor is not the owner', async () => {
		const instructor = makeInstructor()
		const anotherInstructor = makeInstructor()
		const course = makeCourse({ instructorId: anotherInstructor.id })

		instructorsRepository.create(instructor)
		instructorsRepository.create(anotherInstructor)
		coursesRepository.create(course)

		const result = await sut.execute({
			courseId: course.id.toString(),
			instructorId: instructor.id.toString(),
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})

	it('should return ResourceNotFoundError if course does not exist', async () => {
		const instructor = makeInstructor()
		instructorsRepository.create(instructor)

		const result = await sut.execute({
			courseId: 'non-existent-course',
			instructorId: instructor.id.toString(),
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
