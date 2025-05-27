import { Module } from '@nestjs/common'
import { NestUseCaseModule } from '../adapters/nestUseCase.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { FetchCourseCategoriesController } from './controllers/course-category/fetch-course-category/fetch-course-category.controller'
import { FetchCourseByCategoryController } from './controllers/course/fetch-course-by-category/fetch-course-by-category.controller'
import { FetchCourseController } from './controllers/course/fetch-course/fetch-course.controller'
import { GetCourseBySlugController } from './controllers/course/get-course-by-slug/get-course-by-slug.controller'
import { GetCourseController } from './controllers/course/get-course/get-couser.controller'
import { CreateCourseController } from './controllers/instructor/create-course/create-course.controller'
import { DeleteCourseController } from './controllers/instructor/delete-course/delete-course.controller'
import { GetInstructorController } from './controllers/instructor/get-instructor/get-instructor.controller'
import { GetInstructorProfileController } from './controllers/instructor/get-profile/get-instructor-profile.controller'
import { PublishCourseController } from './controllers/instructor/publish-course/publish-course.controller'
import { GetStudentProfileController } from './controllers/student/get-profile/get-student-profile.controller'
import { GetStudentController } from './controllers/student/get-student/get-student.controller'
import { RequestEnrollStudentController } from './controllers/student/request-enroll/request-enroll.controller'
import { AuthenticateInstructorController } from './controllers/user/authenticate/authenticate-instructor.controller'
import { AuthenticateStudentController } from './controllers/user/authenticate/authenticate-student.controller'
import { CreateAccountInstructorController } from './controllers/user/register/register-instructor.controller'
import { CreateAccountStudentController } from './controllers/user/register/register-student.controller'

@Module({
	imports: [DatabaseModule, NestUseCaseModule, CryptographyModule],
	controllers: [
		CreateAccountStudentController,
		AuthenticateStudentController,
		GetStudentController,
		GetStudentProfileController,
		CreateAccountInstructorController,
		AuthenticateInstructorController,
		GetInstructorController,
		GetInstructorProfileController,
		CreateCourseController,
		PublishCourseController,
		FetchCourseController,
		FetchCourseByCategoryController,
		GetCourseBySlugController,
		GetCourseController,
		DeleteCourseController,
		RequestEnrollStudentController,
		FetchCourseCategoriesController,
	],
})
export class HttpModule {}
