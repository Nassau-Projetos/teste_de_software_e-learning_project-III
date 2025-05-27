import { CourseCategorysRepository } from '@/api/domain/e-learning/application/repositories/course-catogories-repository'
import { CourseStatusesRepository } from '@/api/domain/e-learning/application/repositories/course-status-repository'
import { CoursesRepository } from '@/api/domain/e-learning/application/repositories/courses-repository'
import { EnrollmentsRepository } from '@/api/domain/e-learning/application/repositories/enrollment-repository'
import { InstructorsRepository } from '@/api/domain/e-learning/application/repositories/instructors-repository'
import { StudentsRepository } from '@/api/domain/e-learning/application/repositories/students-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCourseCategoryRepository } from './prisma/repositories/prisma-course-category-repository'
import { PrismaCourseRepository } from './prisma/repositories/prisma-course-repository'
import { PrismaEnrollmentRepository } from './prisma/repositories/prisma-enrollment-repository'
import { PrismaInstructorRepository } from './prisma/repositories/prisma-instructor-repository'
import { PrismaStatusRepository } from './prisma/repositories/prisma-status.repository'
import { PrismaStudentRepository } from './prisma/repositories/prisma-student-repository'

@Module({
	providers: [
		PrismaService,
		{ provide: StudentsRepository, useClass: PrismaStudentRepository },
		{ provide: InstructorsRepository, useClass: PrismaInstructorRepository },
		{ provide: CoursesRepository, useClass: PrismaCourseRepository },
		{
			provide: CourseCategorysRepository,
			useClass: PrismaCourseCategoryRepository,
		},
		{
			provide: EnrollmentsRepository,
			useClass: PrismaEnrollmentRepository,
		},
		{
			provide: CourseStatusesRepository,
			useClass: PrismaStatusRepository,
		},
	],
	exports: [
		PrismaService,
		StudentsRepository,
		InstructorsRepository,
		CoursesRepository,
		CourseCategorysRepository,
		EnrollmentsRepository,
		CourseStatusesRepository,
	],
})
export class DatabaseModule {}
