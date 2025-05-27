import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { GetInstructorUseCase } from '@/api/domain/e-learning/application/use-cases/instructor/get-instructor'
import { JwtAuthGuard } from '@/api/infra/auth/jwt-auth.guard'
import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
	UseGuards,
} from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'
import { InstructorProfilePresenter } from '../../../presenters/instructor/instructor-profile-presenter'

const uuidParamPipe = new ZodValidationPipe(z.string().uuid())

@Controller('/instructors')
@UseGuards(JwtAuthGuard)
export class GetInstructorProfileController {
	constructor(private getInstructorUseCase: GetInstructorUseCase) {}

	@Get(':instructorId/profile')
	@HttpCode(HttpStatus.OK)
	async handle(@Param('instructorId', uuidParamPipe) instructorId: string) {
		const result = await this.getInstructorUseCase.execute({
			instructorId,
		})

		if (result.isLeft()) {
			const error = result.value

			if (error instanceof ResourceNotFoundError) {
				throw new NotFoundException('Instructor not found')
			}

			throw new Error('Unhandled error')
		}

		return InstructorProfilePresenter.toHttp(result.value.instructor)
	}
}
