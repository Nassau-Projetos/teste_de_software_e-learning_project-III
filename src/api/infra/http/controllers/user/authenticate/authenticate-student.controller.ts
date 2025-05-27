import { AuthenticateStudentUseCase } from '@/api/domain/e-learning/application/use-cases/user/authenticate/authenticate-student'
import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { z } from 'zod'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'
import { AuthenticateStudentPresenter } from '../../../presenters/user/authenticate/authenticate-student-presenter'

const authenticateStudentBodySchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

type AuthenticateStudentBodySchema = z.infer<
	typeof authenticateStudentBodySchema
>

@Controller('/sessions/students')
export class AuthenticateStudentController {
	constructor(
		private authenticateStudentUseCase: AuthenticateStudentUseCase,
		private jwt: JwtService,
	) {}

	@Post()
	@UsePipes(new ZodValidationPipe(authenticateStudentBodySchema))
	async handle(@Body() body: AuthenticateStudentBodySchema) {
		const { email, password } = body

		const result = await this.authenticateStudentUseCase.execute({
			email,
			password,
		})

		if (result.isLeft()) {
			throw new Error()
		}

		const { accessToken, student } = result.value

		return AuthenticateStudentPresenter.toHttp(student, accessToken)
	}
}
