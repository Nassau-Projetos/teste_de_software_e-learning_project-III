import { StudentsRepository } from '@/api/domain/e-learning/application/repositories/students-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaStudentRepository } from './prisma/repositories/prisma-student-repository'

@Module({
	providers: [
		PrismaService,
		{ provide: StudentsRepository, useClass: PrismaStudentRepository },
	],
	exports: [PrismaService, StudentsRepository],
})
export class DatabaseModule {}
