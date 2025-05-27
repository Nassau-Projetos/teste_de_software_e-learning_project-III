import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { PublishCourseUseCase } from '@/api/domain/e-learning/application/use-cases/instructor/publish-course'
import { CurrentUser } from '@/api/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/api/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/api/infra/auth/jwt.strategy'
import {
	BadRequestException,
	Controller,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
	Patch,
	UseGuards,
} from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'

const uuidParamPipe = new ZodValidationPipe(z.string().uuid())

@Controller('/instructors/course/publish')
@UseGuards(JwtAuthGuard)
export class PublishCourseController {
	constructor(private publishCourseUseCase: PublishCourseUseCase) {}

	@Patch(':courseId')
	@HttpCode(HttpStatus.OK)
	async handle(
		@Param('courseId', uuidParamPipe) courseId: string,
		@CurrentUser() user: UserPayload,
	) {
		const instructorId = user.sub

		const result = await this.publishCourseUseCase.execute({
			courseId,
			instructorId,
		})

		if (result.isLeft()) {
			const error = result.value

			if (error instanceof ResourceNotFoundError) {
				throw new NotFoundException(error.message)
			}

			if (error instanceof NotAllowedError) {
				throw new BadRequestException(error.message)
			}

			throw new BadRequestException('Erro inesperado ao realizar matrícula')
		}
	}
}
