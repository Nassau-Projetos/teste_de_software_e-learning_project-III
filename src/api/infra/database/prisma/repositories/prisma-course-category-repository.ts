import {
	CourseCategorysRepository,
	FindUniqueCourseCategoryQuery,
} from '@/api/domain/e-learning/application/repositories/course-catogories-repository'
import { CourseCategory } from '@/api/domain/e-learning/enterprise/entities/course-category'
import { PrismaCourseCategoryMapper } from '../mappers/prisma-course-category-mapper'
import { PrismaService } from '../prisma.service'

export class PrismaCourseCategoryRepository
	implements CourseCategorysRepository
{
	constructor(private prisma: PrismaService) {}
	async findUnique({
		categoryId,
	}: FindUniqueCourseCategoryQuery): Promise<CourseCategory | null> {
		const courseCategory = await this.prisma.courseCategory.findUnique({
			where: { id: categoryId },
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

	async save(category: CourseCategory): Promise<void> {
		const data = PrismaCourseCategoryMapper.toPrisma(category)

		await this.prisma.courseCategory.update({ where: { id: data.id }, data })
	}

	async delete(categoryId: number): Promise<void> {
		await this.prisma.courseCategory.delete({
			where: { id: categoryId },
		})
	}
}
