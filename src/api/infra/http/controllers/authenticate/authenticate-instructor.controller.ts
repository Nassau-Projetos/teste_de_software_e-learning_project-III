import { AuthenticateInstructorUseCase } from '@/api/domain/e-learning/application/use-cases/authenticate/authenticate-instructor'
import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const authenticateInstructorBodySchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

type AuthenticateInstructorBodySchema = z.infer<
	typeof authenticateInstructorBodySchema
>

@Controller('/sessions/instructors')
export class AuthenticateInstructorController {
	constructor(
		private authenticateInstructorUseCase: AuthenticateInstructorUseCase,
		private jwt: JwtService,
	) {}

	@Post()
	@UsePipes(new ZodValidationPipe(authenticateInstructorBodySchema))
	async handle(@Body() body: AuthenticateInstructorBodySchema) {
		const { email, password } = body

		const result = await this.authenticateInstructorUseCase.execute({
			email,
			password,
		})

		if (result.isLeft()) {
			throw new Error()
		}

		const { accessToken } = result.value

		return {
			access_token: accessToken,
		}
	}
}
