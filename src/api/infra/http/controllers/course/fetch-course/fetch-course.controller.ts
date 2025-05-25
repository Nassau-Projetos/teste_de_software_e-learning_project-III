import { getCategoryIdByKey } from '@/api/core/utils/get-category-by-id'
import { FetchCoursesByCategoryUseCase } from '@/api/domain/e-learning/application/use-cases/course/fetch-courses-by-category'
import { InvalidCategoryError } from '@/api/domain/e-learning/application/use-cases/errors/course-category/invalid-category-error'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'

const pageQueryParamSchema = z.object({
	categoryName: z
		.string()
		.refine((val) => !!getCategoryIdByKey(val), {
			message: 'Categoria inválida',
		})
		.transform((val) => getCategoryIdByKey(val)!),
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
export class FetchCourseByCategoryController {
	constructor(
		private fetchCourseByCategoryUseCase: FetchCoursesByCategoryUseCase,
	) {}

	@Get()
	async handle(@Query(queryValidationPipe) query: PageQueryParamSchema) {
		const { categoryName, limit, page } = query

		const result = await this.fetchCourseByCategoryUseCase.execute({
			categoryId: categoryName,
			limit,
			page,
		})

		if (result.isLeft()) {
			const error = result.value

			if (error instanceof InvalidCategoryError) {
				throw new BadRequestException(error.message)
			}

			throw new Error('Unexpected error')
		}

		const courses = result.value.courses

		return { courses }
	}
}
