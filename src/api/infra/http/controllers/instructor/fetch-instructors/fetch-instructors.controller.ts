import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { FetchInstructorsUseCase } from '@/api/domain/e-learning/application/use-cases/instructor/fetch-instructors'
import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'
import { InstructorPresenter } from '../../../presenters/instructor/instructor-presenter'

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

@Controller('/instructors')
export class FetchInstructorController {
	constructor(private fetchInstructorUseCase: FetchInstructorsUseCase) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async handle(@Query(queryValidationPipe) query: PageQueryParamSchema) {
		const { limit, page } = query

		const result = await this.fetchInstructorUseCase.execute({
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

		const instructors = result.value.instructors

		return { instructors: instructors.map(InstructorPresenter.toHttp) }
	}
}
