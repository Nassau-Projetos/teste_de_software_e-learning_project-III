import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { GetCourseUseCase } from '@/api/domain/e-learning/application/use-cases/course/get-course'
import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
} from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'
import { CourseDetailsPresenter } from '../../../presenters/course/course-details-presenter'

const uuidParamPipe = new ZodValidationPipe(z.string().uuid())

@Controller('/courses')
export class GetCourseController {
	constructor(private getCourseUseCase: GetCourseUseCase) {}

	@Get(':courseId')
	@HttpCode(HttpStatus.OK)
	async handle(@Param('courseId', uuidParamPipe) courseId: string) {
		const result = await this.getCourseUseCase.execute({ courseId })

		if (result.isLeft()) {
			const error = result.value

			if (error instanceof ResourceNotFoundError) {
				throw new NotFoundException('Course not found')
			}

			throw new Error('Unhandled error')
		}

		const { course, instructorName } = result.value

		return CourseDetailsPresenter.toHttp(course, instructorName)
	}
}
