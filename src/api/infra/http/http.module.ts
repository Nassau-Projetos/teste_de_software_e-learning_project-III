import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { NestUseCaseModule } from '../use-cases/nestUseCase.module'
import { AuthenticateStudentController } from './controllers/authenticate/authenticate-student.controller'
import { CreateAccountStudentController } from './controllers/student/register-student'

@Module({
	imports: [DatabaseModule, NestUseCaseModule, CryptographyModule],
	controllers: [CreateAccountStudentController, AuthenticateStudentController],
})
export class HttpModule {}
