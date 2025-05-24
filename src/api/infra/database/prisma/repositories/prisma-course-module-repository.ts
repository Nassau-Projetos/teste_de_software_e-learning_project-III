import {
    CourseModulesRepository,
} from '@/api/domain/e-learning/application/repositories/course-modules-repository'
import { CourseModule } from '@/api/domain/e-learning/enterprise/entities/course-module'
import { PrismaCourseModuleMapper } from '../mappers/prisma-course-module-mapper'
import { PrismaService } from '../prisma.service'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'

export class PrismaCourseModuleRepository implements CourseModulesRepository {
    constructor(private prisma: PrismaService) {}
    async findById(moduleId: UniqueEntityId): Promise<CourseModule | null> {
        const courseModule = await this.prisma.courseModule.findUnique({
            where: { id: moduleId.toString() },
        })

        if (!courseModule) return null

        return PrismaCourseModuleMapper.toDomain(courseModule)
    }

    async findByCourseId(courseId: UniqueEntityId): Promise<CourseModule[]> {
        const modules = await this.prisma.courseModule.findMany({
            where: { courseId: courseId.toString() },
        })
        return modules.map((module) => PrismaCourseModuleMapper.toDomain(module))
    }

    async create(data: CourseModule): Promise<void> {
        await this.prisma.courseModule.create({
            data: PrismaCourseModuleMapper.toPrisma(data),
        })
    }

    async save(courseModule: CourseModule): Promise<void> {
        const data = PrismaCourseModuleMapper.toPrisma(courseModule)

        await this.prisma.courseModule.update({ where: { id: data.id }, data })
    }

    async delete(moduleId: UniqueEntityId): Promise<void> {
		await this.prisma.courseModule.delete({
			where: { id: moduleId.toString() },
		})
    }
}