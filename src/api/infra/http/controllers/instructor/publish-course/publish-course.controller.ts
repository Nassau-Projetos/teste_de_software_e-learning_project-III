import { PublishCourseUseCase } from '@/api/domain/e-learning/application/use-cases/instructor/publish-course'
import { CurrentUser } from '@/api/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/api/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/api/infra/auth/jwt.strategy'
import {
	Controller,
	HttpCode,
	HttpStatus,
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
			throw new Error()
		}
	}
}
