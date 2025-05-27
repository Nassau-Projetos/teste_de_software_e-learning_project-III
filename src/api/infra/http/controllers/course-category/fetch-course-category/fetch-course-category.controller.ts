import { FetchCourseCategoriesUseCase } from '@/api/domain/e-learning/application/use-cases/course-category/fetch-course-categories'
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'
import { CourseCategoryPresenter } from '../../../presenters/course-category/course-category-presenter'

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

@Controller('/categories')
export class FetchCourseCategoriesController {
	constructor(
		private fetchCourseCategoriesUseCase: FetchCourseCategoriesUseCase,
	) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async handle(@Query(queryValidationPipe) query: PageQueryParamSchema) {
		const { limit, page } = query

		const result = await this.fetchCourseCategoriesUseCase.execute({
			limit,
			page,
		})

		if (result.isLeft()) {
			throw new Error('Unexpected error')
		}

		const courseCategories = result.value.courseCategories

		return {
			courseCategories: courseCategories.map(CourseCategoryPresenter.toHttp),
		}
	}
}
