import { AuthenticateInstructorUseCase } from '@/api/domain/e-learning/application/use-cases/authenticate/authenticate-instructor'
import { AuthenticateStudentUseCase } from '@/api/domain/e-learning/application/use-cases/authenticate/authenticate-student'
import { CreateCourseUseCase } from '@/api/domain/e-learning/application/use-cases/course/create-course'
import { FetchCoursesByCategoryUseCase } from '@/api/domain/e-learning/application/use-cases/course/fetch-courses-by-category'
import { RegisterInstructorUseCase } from '@/api/domain/e-learning/application/use-cases/instructor/register-instructor'
import { RegisterStudentUseCase } from '@/api/domain/e-learning/application/use-cases/student/register-student'
import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { NestAuthenticateInstructorUseCase } from './nest/authenticate/authenticate-instructor'
import { NestAuthenticateStudentUseCase } from './nest/authenticate/authenticate-student'
import { NestCreateCourseUseCase } from './nest/course/nest-create-course'
import { NestFetchCourseByCategoryUseCase } from './nest/course/nest-fetch-course-by-categoryId'
import { NestRegisterInstructorUseCase } from './nest/instructor/nest-register-instructor'
import { NestRegisterStudentUseCase } from './nest/student/nest-register-student'

@Module({
	imports: [DatabaseModule, CryptographyModule],
	providers: [
		{ provide: RegisterStudentUseCase, useClass: NestRegisterStudentUseCase },
		{
			provide: AuthenticateStudentUseCase,
			useClass: NestAuthenticateStudentUseCase,
		},
		{
			provide: RegisterInstructorUseCase,
			useClass: NestRegisterInstructorUseCase,
		},
		{
			provide: AuthenticateInstructorUseCase,
			useClass: NestAuthenticateInstructorUseCase,
		},
		{
			provide: CreateCourseUseCase,
			useClass: NestCreateCourseUseCase,
		},
		{
			provide: FetchCoursesByCategoryUseCase,
			useClass: NestFetchCourseByCategoryUseCase,
		},
	],
	exports: [
		RegisterStudentUseCase,
		AuthenticateStudentUseCase,
		RegisterInstructorUseCase,
		AuthenticateInstructorUseCase,
		CreateCourseUseCase,
		FetchCoursesByCategoryUseCase,
	],
})
export class NestUseCaseModule {}
