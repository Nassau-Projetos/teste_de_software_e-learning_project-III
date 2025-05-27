import { CourseModulesRepository } from '@/api/domain/e-learning/application/repositories/course-modules-repository'
import { CourseModule } from '@/api/domain/e-learning/enterprise/entities/course-module'
import { Injectable } from '@nestjs/common'
import { PrismaCourseModuleMapper } from '../mappers/prisma-course-module-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCourseModuleRepository implements CourseModulesRepository {
	constructor(private prisma: PrismaService) {}
	async findById(moduleId: string): Promise<CourseModule | null> {
		const courseModule = await this.prisma.courseModule.findUnique({
			where: { id: moduleId },
			include: { status: true },
		})

		if (!courseModule) return null

		return PrismaCourseModuleMapper.toDomain(courseModule)
	}

	async findByCourseId(courseId: string): Promise<CourseModule[]> {
		const modules = await this.prisma.courseModule.findMany({
			where: { courseId: courseId },
			include: { status: true },
		})
		return modules.map((module) => PrismaCourseModuleMapper.toDomain(module))
	}

	async create(data: CourseModule): Promise<void> {
		await this.prisma.courseModule.create({
			data: PrismaCourseModuleMapper.toPrisma(data),
			include: { status: true },
		})
	}

	async save(courseModule: CourseModule): Promise<void> {
		const data = PrismaCourseModuleMapper.toPrisma(courseModule)

		await this.prisma.courseModule.update({ where: { id: data.id }, data })
	}

	async delete(moduleId: string): Promise<void> {
		await this.prisma.courseModule.delete({
			where: { id: moduleId },
		})
	}
}
