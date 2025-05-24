import {
    CourseCategorysRepository,
    FindUniqueCourseCategoryQuery,
    UpdateCourseCategoryOptions,
} from '@/api/domain/e-learning/application/repositories/course-catogories-repository'
import { PrismaCourseCategoryMapper } from '../mappers/prisma-course-category-mapper'
import { PrismaService } from '../prisma.service'
import { CourseCategory } from '@/api/domain/e-learning/enterprise/entities/course-category'

export class PrismaCourseCategoryRepository implements CourseCategorysRepository {
    constructor(private prisma: PrismaService) {}
    async findUnique({
        categoryId,
        name,
    }: FindUniqueCourseCategoryQuery): Promise<CourseCategory | null> {
        const whereClause: any = {}
		
		if (categoryId !== undefined) {
			whereClause.id = categoryId
		}
		
		if (name !== undefined) {
			whereClause.name = name
		}

		const courseCategory = await this.prisma.courseCategory.findUnique({
			where: whereClause,
		})

		if (!courseCategory) return null

		return PrismaCourseCategoryMapper.toDomain(courseCategory)
    }

    async create(data: CourseCategory): Promise<CourseCategory> {
        const createdCategory = await this.prisma.courseCategory.create({
            data: PrismaCourseCategoryMapper.toPrisma(data),
        })
        return PrismaCourseCategoryMapper.toDomain(createdCategory)
    }

    async update(categoryId: number,updateData: UpdateCourseCategoryOptions): Promise<CourseCategory | null> {
		const prismaUpdateData: any = {}

		if (updateData.name !== undefined) {
			prismaUpdateData.name = updateData.name
		}

		if (updateData.icon !== undefined) {
			prismaUpdateData.icon = updateData.icon
		}

		if (updateData.courseCount !== undefined) {
			prismaUpdateData.courseCount = updateData.courseCount
		}

		prismaUpdateData.updatedAt = new Date()

		try {
			const updatedCategory = await this.prisma.courseCategory.update({
				where: { id: categoryId },
				data: prismaUpdateData,
			})

			return PrismaCourseCategoryMapper.toDomain(updatedCategory)
		} catch (error) {
			return null
		}
	}

    async delete(categoryId: number): Promise<void> {
		await this.prisma.courseCategory.delete({
			where: { id: categoryId },
		})
    }
}
