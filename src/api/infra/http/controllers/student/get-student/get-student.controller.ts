import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { GetStudentUseCase } from '@/api/domain/e-learning/application/use-cases/student/get-student'
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
import { StudentPresenter } from '../../../presenters/student/student-presenter'

const uuidParamPipe = new ZodValidationPipe(z.string().uuid())

@Controller('/students')
export class GetStudentController {
	constructor(private getStudentUseCase: GetStudentUseCase) {}

	@Get(':studentId')
	@HttpCode(HttpStatus.OK)
	async handle(@Param('studentId', uuidParamPipe) studentId: string) {
		const result = await this.getStudentUseCase.execute({ studentId })

		if (result.isLeft()) {
			const error = result.value

			if (error instanceof ResourceNotFoundError) {
				throw new NotFoundException('Student not found')
			}

			throw new Error('Unhandled error')
		}

		return StudentPresenter.toHttp(result.value.student)
	}
}
