import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { GetInstructorUseCase } from '@/api/domain/e-learning/application/use-cases/instructor/get-instructor'
import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
} from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'
import { InstructorPresenter } from '../../../presenters/instructor/instructor-presenter'

const uuidParamPipe = new ZodValidationPipe(z.string().uuid())

@Controller('/instructors')
export class GetInstructorController {
	constructor(private getInstructorUseCase: GetInstructorUseCase) {}

	@Get(':instructorId')
	@HttpCode(HttpStatus.OK)
	async handle(@Param('instructorId', uuidParamPipe) instructorId: string) {
		const result = await this.getInstructorUseCase.execute({ instructorId })

		if (result.isLeft()) {
			const error = result.value

			if (error instanceof ResourceNotFoundError) {
				throw new NotFoundException('Instructor not found')
			}

			throw new Error('Unhandled error')
		}

		return InstructorPresenter.toHttp(result.value.instructor)
	}
}
