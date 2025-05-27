import { FetchCoursesUseCase } from '@/api/domain/e-learning/application/use-cases/course/fetch-course'
import { FetchCoursesByCategoryUseCase } from '@/api/domain/e-learning/application/use-cases/course/fetch-courses-by-category'
import { GetCourseUseCase } from '@/api/domain/e-learning/application/use-cases/course/get-course'
import { GetCourseBySlugUseCase } from '@/api/domain/e-learning/application/use-cases/course/get-course-by-slug'
import { CreateCourseUseCase } from '@/api/domain/e-learning/application/use-cases/instructor/create-course'
import { DeleteCourseUseCase } from '@/api/domain/e-learning/application/use-cases/instructor/delete-course'
import { GetInstructorUseCase } from '@/api/domain/e-learning/application/use-cases/instructor/get-instructor'
import { PublishCourseUseCase } from '@/api/domain/e-learning/application/use-cases/instructor/publish-course'
import { GetStudentUseCase } from '@/api/domain/e-learning/application/use-cases/student/get-student'
import { RequestEnrollStudentUseCase } from '@/api/domain/e-learning/application/use-cases/student/request-enroll-student'
import { AuthenticateInstructorUseCase } from '@/api/domain/e-learning/application/use-cases/user/authenticate/authenticate-instructor'
import { AuthenticateStudentUseCase } from '@/api/domain/e-learning/application/use-cases/user/authenticate/authenticate-student'
import { RegisterInstructorUseCase } from '@/api/domain/e-learning/application/use-cases/user/register/register-instructor'
import { RegisterStudentUseCase } from '@/api/domain/e-learning/application/use-cases/user/register/register-student'
import { Module } from '@nestjs/common'
import { NestFetchCourseUseCase } from '../adapters/nest/course/nest-fetch-course'
import { NestFetchCourseByCategoryUseCase } from '../adapters/nest/course/nest-fetch-course-by-categoryId'
import { NestGetCourseUseCase } from '../adapters/nest/course/nest-get-course'
import { NestGetCourseBySlugUseCase } from '../adapters/nest/course/nest-get-course-by-slug'
import { NestCreateCourseUseCase } from '../adapters/nest/instructor/nest-create-course'
import { NestDeleteCourseUseCase } from '../adapters/nest/instructor/nest-delete-course'
import { NestGetInstructorUseCase } from '../adapters/nest/instructor/nest-get-instructor'
import { NestPublishCourseUseCase } from '../adapters/nest/instructor/nest-publish-course'
import { NestGetStudentUseCase } from '../adapters/nest/student/nest-get-student'
import { NestRequestEnrollStudentUseCase } from '../adapters/nest/student/nest-request-enroll'
import { NestAuthenticateInstructorUseCase } from '../adapters/nest/user/authenticate/authenticate-instructor'
import { NestAuthenticateStudentUseCase } from '../adapters/nest/user/authenticate/authenticate-student'
import { NestRegisterInstructorUseCase } from '../adapters/nest/user/register/nest-register-instructor'
import { NestRegisterStudentUseCase } from '../adapters/nest/user/register/nest-register-student'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'

@Module({
	imports: [DatabaseModule, CryptographyModule],
	providers: [
		{ provide: RegisterStudentUseCase, useClass: NestRegisterStudentUseCase },
		{
			provide: AuthenticateStudentUseCase,
			useClass: NestAuthenticateStudentUseCase,
		},
		{
			provide: GetStudentUseCase,
			useClass: NestGetStudentUseCase,
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
			provide: GetInstructorUseCase,
			useClass: NestGetInstructorUseCase,
		},
		{
			provide: CreateCourseUseCase,
			useClass: NestCreateCourseUseCase,
		},
		{
			provide: PublishCourseUseCase,
			useClass: NestPublishCourseUseCase,
		},
		{
			provide: FetchCoursesByCategoryUseCase,
			useClass: NestFetchCourseByCategoryUseCase,
		},
		{
			provide: FetchCoursesUseCase,
			useClass: NestFetchCourseUseCase,
		},
		{
			provide: GetCourseBySlugUseCase,
			useClass: NestGetCourseBySlugUseCase,
		},
		{
			provide: GetCourseUseCase,
			useClass: NestGetCourseUseCase,
		},
		{
			provide: DeleteCourseUseCase,
			useClass: NestDeleteCourseUseCase,
		},
		{
			provide: RequestEnrollStudentUseCase,
			useClass: NestRequestEnrollStudentUseCase,
		},
	],
	exports: [
		RegisterStudentUseCase,
		AuthenticateStudentUseCase,
		GetStudentUseCase,
		RegisterInstructorUseCase,
		AuthenticateInstructorUseCase,
		GetInstructorUseCase,
		CreateCourseUseCase,
		PublishCourseUseCase,
		FetchCoursesByCategoryUseCase,
		FetchCoursesUseCase,
		GetCourseBySlugUseCase,
		GetCourseUseCase,
		DeleteCourseUseCase,
		RequestEnrollStudentUseCase,
	],
})
export class NestUseCaseModule {}
