import { CourseCategorysRepository } from '@/api/domain/e-learning/application/repositories/course-catogories-repository'
import { CoursesRepository } from '@/api/domain/e-learning/application/repositories/courses-repository'
import { InstructorsRepository } from '@/api/domain/e-learning/application/repositories/instructors-repository'
import { DeleteCourseUseCase } from '@/api/domain/e-learning/application/use-cases/instructor/delete-course'

import { Injectable } from '@nestjs/common'

@Injectable()
export class NestDeleteCourseUseCase extends DeleteCourseUseCase {
	constructor(
		courseRepository: CoursesRepository,
		categoryRepository: CourseCategorysRepository,
		instructorRepository: InstructorsRepository,
	) {
		super(courseRepository, categoryRepository, instructorRepository)
	}
}
