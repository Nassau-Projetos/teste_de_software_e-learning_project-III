import { CreateCourseUseCase } from '@/api/domain/e-learning/application/use-cases/course/create-course'
import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createCourseBodySchema = z.object({
	instructorId: z.string().uuid(),
	title: z.string(),
	description: z.string(),
	thumbnailUrl: z.string(),
	price: z.number(),
	duration: z.number(),
	categoryId: z.number(),
	level: z.string(),
})

type createCourseBodySchema = z.infer<typeof createCourseBodySchema>

@Controller('/courses')
export class CreateCourseController {
	constructor(private createCourseUseCase: CreateCourseUseCase) {}

	@Post()
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(createCourseBodySchema))
	async handle(@Body() body: createCourseBodySchema) {
		const {
			categoryId,
			description,
			duration,
			instructorId,
			level,
			price,
			thumbnailUrl,
			title,
		} = body

		const result = await this.createCourseUseCase.execute({
			categoryId,
			description,
			duration,
			instructorId,
			level,
			price,
			thumbnailUrl,
			title,
		})

		if (result.isLeft()) {
			throw new Error()
		}
	}
}
