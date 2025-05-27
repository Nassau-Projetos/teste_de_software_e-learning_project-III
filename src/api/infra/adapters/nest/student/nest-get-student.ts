import { StudentsRepository } from '@/api/domain/e-learning/application/repositories/students-repository'
import { GetStudentUseCase } from '@/api/domain/e-learning/application/use-cases/student/get-student'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestGetStudentUseCase extends GetStudentUseCase {
	constructor(studentRepository: StudentsRepository) {
		super(studentRepository)
	}
}
