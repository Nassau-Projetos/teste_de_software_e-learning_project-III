import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { CourseNotPublishedError } from '@/api/domain/e-learning/application/use-cases/errors/course/course-not-published-error'
import { RequestEnrollStudentUseCase } from '@/api/domain/e-learning/application/use-cases/student/request-enroll-student'
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
	Post,
	UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'
import { RequestEnrollStudentPresenter } from '../../../presenters/student/request-enroll-presenter'

const uuidParamPipe = new ZodValidationPipe(z.string().uuid())

@Controller('students/course')
@UseGuards(JwtAuthGuard)
export class RequestEnrollStudentController {
	constructor(
		private readonly requestEnrollStudentUseCase: RequestEnrollStudentUseCase,
	) {}

	@Post(':courseId')
	@HttpCode(HttpStatus.CREATED)
	async handle(
		@Param('courseId', uuidParamPipe) courseId: string,
		@CurrentUser() user: UserPayload,
	) {
		const studentId = user.sub

		const result = await this.requestEnrollStudentUseCase.execute({
			courseId,
			studentId,
		})

		if (result.isLeft()) {
			const error = result.value

			if (error instanceof ResourceNotFoundError) {
				throw new NotFoundException(error.message)
			}

			if (error instanceof CourseNotPublishedError) {
				throw new BadRequestException(error.message)
			}

			throw new BadRequestException('Erro inesperado ao realizar matrícula')
		}

		const { enrollment } = result.value

		return RequestEnrollStudentPresenter.toHttp(enrollment)
	}
}
