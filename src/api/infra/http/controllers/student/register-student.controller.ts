import { RegisterStudentUseCase } from '@/api/domain/e-learning/application/use-cases/student/register-student'
import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createAccountStudentBodySchema = z.object({
	name: z.string(),
	cpf: z.string(),
	phoneNumber: z.string(),
	email: z.string().email(),
	password: z.string(),
})

type CreateAccountStudentBodySchema = z.infer<
	typeof createAccountStudentBodySchema
>

@Controller('/accounts/students')
export class CreateAccountStudentController {
	constructor(private registerStudent: RegisterStudentUseCase) {}

	@Post()
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(createAccountStudentBodySchema))
	async handle(@Body() body: CreateAccountStudentBodySchema) {
		const { name, cpf, phoneNumber, email, password } = body

		const result = await this.registerStudent.execute({
			name,
			cpf,
			phoneNumber,
			email,
			password,
		})

		if (result.isLeft()) {
			throw new Error()
		}
	}
}
