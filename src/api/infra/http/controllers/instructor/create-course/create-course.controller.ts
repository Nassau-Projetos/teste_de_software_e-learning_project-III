import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { CreateCourseUseCase } from '@/api/domain/e-learning/application/use-cases/instructor/create-course'
import { CurrentUser } from '@/api/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/api/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/api/infra/auth/jwt.strategy'
import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Post,
	UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'
import { CourseDetailsPresenter } from '../../../presenters/course/course-details-presenter'

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

@Controller('/instructors/course')
@UseGuards(JwtAuthGuard)
export class CreateCourseController {
	constructor(private createCourseUseCase: CreateCourseUseCase) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
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
			const error = result.value

			if (error instanceof ResourceNotFoundError) {
				throw new NotFoundException('Resource not found')
			}

			throw new Error('Unhandled error')
		}

		const { course, instructorName } = result.value

		return CourseDetailsPresenter.toHttp(course, instructorName)
	}
}
