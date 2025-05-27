import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { GetCourseBySlugUseCase } from '@/api/domain/e-learning/application/use-cases/course/get-course-by-slug'
import {
	Controller,
	Get,
	HttpCode,
	NotFoundException,
	Param,
} from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'
import { CoursePresenter } from '../../../presenters/course/course-presenter'

const slugParamSchema = z.string().min(1)
const slugParamPipe = new ZodValidationPipe(slugParamSchema)

@Controller('/courses/slug')
export class GetCourseBySlugController {
	constructor(private getCourseBySlugUseCase: GetCourseBySlugUseCase) {}

	@Get(':slug')
	@HttpCode(200)
	async handle(@Param('slug', slugParamPipe) slug: string) {
		const result = await this.getCourseBySlugUseCase.execute({ slug })

		if (result.isLeft()) {
			if (result.isLeft()) {
				const error = result.value

				if (error instanceof ResourceNotFoundError) {
					throw new NotFoundException('Course not found')
				}

				throw new Error('Unhandled error')
			}
		}

		return CoursePresenter.toHttp(result.value.course)
	}
}
