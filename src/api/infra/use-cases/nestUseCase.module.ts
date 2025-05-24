import { AuthenticateStudentUseCase } from '@/api/domain/e-learning/application/use-cases/authenticate/authenticate-student'
import { RegisterStudentUseCase } from '@/api/domain/e-learning/application/use-cases/student/register-student'
import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { NestAuthenticateStudentUseCase } from './nest/authenticate/authenticate-student'
import { NestRegisterStudentUseCase } from './nest/student/nest-register-student'

@Module({
	imports: [DatabaseModule, CryptographyModule],
	providers: [
		{ provide: RegisterStudentUseCase, useClass: NestRegisterStudentUseCase },
		{
			provide: AuthenticateStudentUseCase,
			useClass: NestAuthenticateStudentUseCase,
		},
	],
	exports: [RegisterStudentUseCase, AuthenticateStudentUseCase],
})
export class NestUseCaseModule {}
