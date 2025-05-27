import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { getStatusIdByKey } from '@/api/core/utils/get-status-by-id'
import { FetchCoursesUseCase } from '@/api/domain/e-learning/application/use-cases/course/fetch-course'
import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'
import { CoursePresenter } from '../../../presenters/course/course-presenter'

const pageQueryParamSchema = z.object({
	page: z
		.string()
		.optional()
		.default('1')
		.transform(Number)
		.pipe(z.number().min(1)),
	limit: z
		.string()
		.optional()
		.default('20')
		.transform(Number)
		.pipe(z.number().min(1).max(100)),
})

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/courses')
export class FetchCourseController {
	constructor(private fetchCourseUseCase: FetchCoursesUseCase) {}

	@Get()
	@HttpCode(200)
	async handle(@Query(queryValidationPipe) query: PageQueryParamSchema) {
		const { limit, page } = query

		const publishedStatusId = getStatusIdByKey('PUBLISHED')

		const result = await this.fetchCourseUseCase.execute({
			statusId: publishedStatusId!,
			limit,
			page,
		})

		if (result.isLeft()) {
			const error = result.value

			if (error instanceof ResourceNotFoundError) {
				throw new BadRequestException(error.message)
			}

			throw new Error('Unexpected error')
		}

		const courses = result.value.courses

		return { courses: courses.map(CoursePresenter.toHttp) }
	}
}
