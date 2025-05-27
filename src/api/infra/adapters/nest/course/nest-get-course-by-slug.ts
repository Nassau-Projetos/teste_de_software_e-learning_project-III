import { CoursesRepository } from '@/api/domain/e-learning/application/repositories/courses-repository'
import { GetCourseBySlugUseCase } from '@/api/domain/e-learning/application/use-cases/course/get-course-by-slug'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestGetCourseBySlugUseCase extends GetCourseBySlugUseCase {
	constructor(courseRepository: CoursesRepository) {
		super(courseRepository)
	}
}
