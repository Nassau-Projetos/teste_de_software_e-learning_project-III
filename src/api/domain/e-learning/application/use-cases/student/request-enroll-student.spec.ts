import { STATUS } from '@/api/core/enums/status'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { makeCourse } from '@/tests/factories/make-course'
import { makeCourseStatus } from '@/tests/factories/make-course-statuses'
import { makeStudent } from '@/tests/factories/make-student'
import { InMemoryCoursesRepository } from '@/tests/repositories/in-memory-course-repository'
import { InMemoryEnrollmentsRepository } from '@/tests/repositories/in-memory-enrollment-repository'
import { InMemoryStudentsRepository } from '@/tests/repositories/in-memory-students-repository'
import { CourseNotPublishedError } from '../errors/course/course-not-published-error'
import { RequestEnrollStudentUseCase } from './request-enroll-student'

describe('RequestEnrollStudentUseCase', () => {
	let studentRepository: InMemoryStudentsRepository
	let coursesRepository: InMemoryCoursesRepository
	let enrollmentRepository: InMemoryEnrollmentsRepository
	let sut: RequestEnrollStudentUseCase

	beforeEach(() => {
		studentRepository = new InMemoryStudentsRepository()
		coursesRepository = new InMemoryCoursesRepository()
		enrollmentRepository = new InMemoryEnrollmentsRepository()
		sut = new RequestEnrollStudentUseCase(
			studentRepository,
			coursesRepository,
			enrollmentRepository,
		)
	})

	it('should enroll a student in a published course', async () => {
		const student = makeStudent()
		const status = makeCourseStatus(STATUS.PUBLISHED)
		const course = makeCourse({ status: status })
		studentRepository.create(student)
		coursesRepository.create(course)

		const result = await sut.execute({
			studentId: student.id.toString(),
			courseId: course.id.toString(),
		})

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.enrollment.studentId.toString()).toBe(
				student.id.toString(),
			)
			expect(result.value.enrollment.courseId.toString()).toBe(
				course.id.toString(),
			)
		}
	})

	it('should return ResourceNotFoundError if student does not exist', async () => {
		const status = makeCourseStatus(STATUS.PUBLISHED)
		const course = makeCourse({ status: status })

		coursesRepository.create(course)

		const result = await sut.execute({
			studentId: 'non-existent-student-id',
			courseId: course.id.toString(),
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should return ResourceNotFoundError if course does not exist', async () => {
		const student = makeStudent()

		studentRepository.create(student)

		const result = await sut.execute({
			studentId: student.id.toString(),
			courseId: 'non-existent-course-id',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should return CourseNotPublishedError if course is not published', async () => {
		const student = makeStudent()
		const status = makeCourseStatus(STATUS.DRAFT)
		const course = makeCourse({ status: status })

		studentRepository.create(student)
		coursesRepository.create(course)

		const result = await sut.execute({
			studentId: student.id.toString(),
			courseId: course.id.toString(),
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(CourseNotPublishedError)
	})
})
