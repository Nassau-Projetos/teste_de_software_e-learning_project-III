import { Either, left, right } from '@/api/core/either/either'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Enrollment } from '../../../enterprise/entities/enrollment'
import { CoursesRepository } from '../../repositories/courses-repository'
import { EnrollmentsRepository } from '../../repositories/enrollment-repository'
import { StudentsRepository } from '../../repositories/students-repository'
import { CourseNotPublishedError } from '../errors/course/course-not-published-error'

interface RequestEnrollStudentUseCaseRequest {
	studentId: string
	courseId: string
}

type RequestEnrollStudentUseCaseResponse = Either<
	ResourceNotFoundError | CourseNotPublishedError,
	{
		enrollment: Enrollment
	}
>

export class RequestEnrollStudentUseCase {
	constructor(
		private readonly studentRepository: StudentsRepository,
		private readonly coursesRepository: CoursesRepository,
		private readonly enrollmentRepository: EnrollmentsRepository,
	) {}

	async execute({
		studentId,
		courseId,
	}: RequestEnrollStudentUseCaseRequest): Promise<RequestEnrollStudentUseCaseResponse> {
		const student = await this.studentRepository.findUnique({ studentId })
		const course = await this.coursesRepository.findUnique({ courseId })

		if (!student || !course) {
			return left(new ResourceNotFoundError())
		}

		if (!course.status.isPublished()) {
			return left(new CourseNotPublishedError())
		}

		const requestedEnrollment = student.requestEnroll(course.id)

		await this.enrollmentRepository.create(requestedEnrollment)
		await this.studentRepository.save(student)

		return right({ enrollment: requestedEnrollment })
	}
}
