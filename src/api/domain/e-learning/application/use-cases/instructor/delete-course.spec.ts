import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { makeCourse } from '@/tests/factories/make-course'
import { makeCourseCategory } from '@/tests/factories/make-course-category'
import { makeInstructor } from '@/tests/factories/make-instructor'
import { InMemoryCourseCategorysRepository } from '@/tests/repositories/in-memory-course-category-repository'
import { InMemoryCoursesRepository } from '@/tests/repositories/in-memory-course-repository'
import { InMemoryInstructorsRepository } from '@/tests/repositories/in-memory-instructor-repository'
import { DeleteCourseUseCase } from './delete-course'

describe('DeleteCourseUseCase', () => {
	let coursesRepository: InMemoryCoursesRepository
	let instructorsRepository: InMemoryInstructorsRepository
	let categoriesRepository: InMemoryCourseCategorysRepository
	let sut: DeleteCourseUseCase

	beforeEach(() => {
		coursesRepository = new InMemoryCoursesRepository()
		instructorsRepository = new InMemoryInstructorsRepository()
		categoriesRepository = new InMemoryCourseCategorysRepository()
		sut = new DeleteCourseUseCase(
			coursesRepository,
			categoriesRepository,
			instructorsRepository,
		)
	})

	it('should delete course when instructor is owner', async () => {
		const instructor = makeInstructor()
		const category = makeCourseCategory({ icon: 'icon1' })
		const course = makeCourse({ instructorId: instructor.id, category })

		instructorsRepository.create(instructor)
		categoriesRepository.create(category)
		instructor.addCourse(course)
		coursesRepository.create(course)

		const result = await sut.execute({
			courseId: course.id.toString(),
			instructorId: instructor.id.toString(),
		})

		expect(result.isRight()).toBe(true)
		expect(coursesRepository.items).toHaveLength(0)
	})

	it('should return NotAllowedError if instructor is not the course owner', async () => {
		const instructor = makeInstructor()
		const anotherInstructor = makeInstructor()
		const category = makeCourseCategory({ icon: 'icon' })
		const course = makeCourse({ instructorId: anotherInstructor.id, category })

		instructorsRepository.create(instructor)
		instructorsRepository.create(anotherInstructor)
		categoriesRepository.create(category)
		coursesRepository.create(course)

		const result = await sut.execute({
			courseId: course.id.toString(),
			instructorId: instructor.id.toString(),
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
		expect(coursesRepository.items).toHaveLength(1)
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
