import { CreateCourseUseCase } from '@/api/domain/e-learning/application/use-cases/course/create-course'
import { CurrentUser } from '@/api/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/api/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/api/infra/auth/jwt.strategy'
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'

const createCourseBodySchema = z.object({
	title: z.string(),
	description: z.string(),
	thumbnailUrl: z.string(),
	price: z.number(),
	duration: z.number(),
	categoryId: z.number(),
	level: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createCourseBodySchema)

type CreateCourseBodySchema = z.infer<typeof createCourseBodySchema>

@Controller('/courses')
@UseGuards(JwtAuthGuard)
export class CreateCourseController {
	constructor(private createCourseUseCase: CreateCourseUseCase) {}

	@Post()
	@HttpCode(201)
	async handle(
		@Body(bodyValidationPipe) body: CreateCourseBodySchema,
		@CurrentUser() user: UserPayload,
	) {
		const {
			categoryId,
			description,
			duration,
			level,
			price,
			thumbnailUrl,
			title,
		} = body

		const instructorId = user.sub

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
