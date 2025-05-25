import {
	CoursesRepository,
	FindManyCourseByCategoryIdQuery,
	FindUniqueCourseQuery,
} from '@/api/domain/e-learning/application/repositories/courses-repository'
import { Course } from '@/api/domain/e-learning/enterprise/entities/course'
import { Injectable } from '@nestjs/common'
import { PrismaCourseMapper } from '../mappers/prisma-course-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCourseRepository implements CoursesRepository {
	constructor(private prisma: PrismaService) {}

	async findUnique({
		courseId,
	}: FindUniqueCourseQuery): Promise<Course | null> {
		const course = await this.prisma.course.findUnique({
			where: { id: courseId },
			include: { category: true },
		})

		if (!course) return null

		return PrismaCourseMapper.toDomain(course)
	}

	async findMany(): Promise<Course[]> {
		const courses = await this.prisma.course.findMany({
			where: { status: 'PUBLISHED' },
			include: { category: true },
		})
		return courses.map((course) => PrismaCourseMapper.toDomain(course))
	}

	async findManyByCategoryId({
		categoryId,
		params,
	}: FindManyCourseByCategoryIdQuery): Promise<Course[]> {
		const page = params?.page ?? 1
		const take = params?.limit ?? 20

		const courses = await this.prisma.course.findMany({
			where: { category: { id: categoryId } },
			take,
			skip: (page - 1) * take,
			include: { category: true },
		})

		return courses.map(PrismaCourseMapper.toDomain)
	}

	async create(data: Course): Promise<void> {
		await this.prisma.course.create({
			data: PrismaCourseMapper.toPrisma(data),
			include: { category: true },
		})
	}

	async save(course: Course): Promise<void> {
		const data = PrismaCourseMapper.toPrisma(course)

		await this.prisma.course.update({ where: { id: data.id }, data })
	}

	async remove(course: Course): Promise<void> {
		const data = PrismaCourseMapper.toPrisma(course)

		await this.prisma.course.delete({ where: { id: data.id } })
	}
}
