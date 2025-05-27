import { RegisterInstructorUseCase } from '@/api/domain/e-learning/application/use-cases/user/register/register-instructor'
import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'
import { RegisterInstructorPresenter } from '../../../presenters/user/register/register-instructor-presenter'

const createAccountInstructorBodySchema = z.object({
	name: z.string(),
	bio: z.string(),
	cpf: z.string(),
	phoneNumber: z.string(),
	email: z.string().email(),
	passwordHash: z.string(),
})

type CreateAccountInstructorBodySchema = z.infer<
	typeof createAccountInstructorBodySchema
>

@Controller('/accounts/instructors')
export class CreateAccountInstructorController {
	constructor(private registerInstructor: RegisterInstructorUseCase) {}

	@Post()
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(createAccountInstructorBodySchema))
	async handle(@Body() body: CreateAccountInstructorBodySchema) {
		const { name, bio, cpf, phoneNumber, email, passwordHash } = body

		const result = await this.registerInstructor.execute({
			name,
			bio,
			cpf,
			phoneNumber,
			email,
			passwordHash,
		})

		if (result.isLeft()) {
			throw new Error()
		}

		return RegisterInstructorPresenter.toHttp(result.value.instructor)
	}
}
