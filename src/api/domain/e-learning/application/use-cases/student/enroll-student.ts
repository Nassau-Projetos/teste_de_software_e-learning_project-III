import { Either, left, right } from '@/api/core/either/either'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Student } from '../../../enterprise/entities/student'
import { CoursesRepository } from '../../repositories/courses-repository'
import { PaymentsRepository } from '../../repositories/payments-repository'
import { StudentsRepository } from '../../repositories/students-repository'

interface EnrollStudentUseCaseRequest {
	studentId: string
	courseId: string
	withPayment?: boolean
}

type EnrollStudentUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		student: Student
	}
>

export class EnrollStudentUseCase {
	constructor(
		private readonly studentRepository: StudentsRepository,
		private readonly coursesRepository: CoursesRepository,
		private readonly paymentRepository: PaymentsRepository,
	) {}

	async execute({
		studentId,
		courseId,
		withPayment, //TODO: Corrigir
	}: EnrollStudentUseCaseRequest): Promise<EnrollStudentUseCaseResponse> {
		const student = await this.studentRepository.findUnique({ studentId })
		const course = await this.coursesRepository.findUnique({ courseId })

		if (!student || !course) {
			return left(new ResourceNotFoundError())
		}

		if (!course.status.isPublished()) {
			return left(new ResourceNotFoundError()) //TODO: Trocar o erro
		}

		student.enroll(course.id)
		await this.studentRepository.update(studentId, {})

		return right({ student })
	}
}
