import { DeleteCourseUseCase } from '@/api/domain/e-learning/application/use-cases/instructor/delete-course'
import { CurrentUser } from '@/api/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/api/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/api/infra/auth/jwt.strategy'
import {
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Param,
	UseGuards,
} from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'

const uuidParamPipe = new ZodValidationPipe(z.string().uuid())

@Controller('/instructors/course')
@UseGuards(JwtAuthGuard)
export class DeleteCourseController {
	constructor(private deleteCourseUseCase: DeleteCourseUseCase) {}

	@Delete(':courseId')
	@HttpCode(HttpStatus.NO_CONTENT)
	async handle(
		@Param('courseId', uuidParamPipe) courseId: string,
		@CurrentUser() user: UserPayload,
	) {
		const instructorId = user.sub

		const result = await this.deleteCourseUseCase.execute({
			courseId,
			instructorId,
		})

		if (result.isLeft()) {
			throw new Error()
		}
	}
}
