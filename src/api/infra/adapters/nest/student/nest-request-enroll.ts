import { CoursesRepository } from '@/api/domain/e-learning/application/repositories/courses-repository'
import { EnrollmentsRepository } from '@/api/domain/e-learning/application/repositories/enrollment-repository'
import { StudentsRepository } from '@/api/domain/e-learning/application/repositories/students-repository'
import { RequestEnrollStudentUseCase } from '@/api/domain/e-learning/application/use-cases/student/request-enroll-student'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestRequestEnrollStudentUseCase extends RequestEnrollStudentUseCase {
	constructor(
		studentRepository: StudentsRepository,
		courseRepository: CoursesRepository,
		enrollmentRepository: EnrollmentsRepository,
	) {
		super(studentRepository, courseRepository, enrollmentRepository)
	}
}
