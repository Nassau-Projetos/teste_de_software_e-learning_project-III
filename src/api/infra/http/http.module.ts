import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { NestUseCaseModule } from '../use-cases/nestUseCase.module'
import { AuthenticateInstructorController } from './controllers/authenticate/authenticate-instructor.controller'
import { AuthenticateStudentController } from './controllers/authenticate/authenticate-student.controller'
import { CreateCourseController } from './controllers/course/create-course/create-course.controller'
import { FetchCourseByCategoryController } from './controllers/course/fetch-course/fetch-course.controller'
import { CreateAccountInstructorController } from './controllers/instructor/register-instructor.controller'
import { CreateAccountStudentController } from './controllers/student/register-student.controller'

@Module({
	imports: [DatabaseModule, NestUseCaseModule, CryptographyModule],
	controllers: [
		CreateAccountStudentController,
		AuthenticateStudentController,
		CreateAccountInstructorController,
		AuthenticateInstructorController,
		CreateCourseController,
		FetchCourseByCategoryController,
	],
})
export class HttpModule {}
