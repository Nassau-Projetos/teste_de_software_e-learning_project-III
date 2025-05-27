import {
	CoursesRepository,
	FindManyCourseByCategoryIdQuery,
	FindManyCourseByStatusIdQuery,
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
			include: { category: true, status: true, instructor: true },
		})

		if (!course) return null

		return PrismaCourseMapper.toDomain(course)
	}

	async findBySlug({ slug }: FindUniqueCourseQuery): Promise<Course | null> {
		const course = await this.prisma.course.findFirst({
			where: { slug },
			include: { category: true, status: true },
		})

		if (!course) return null

		return PrismaCourseMapper.toDomain(course)
	}

	async findManyRecent({
		statusId,
		params,
	}: FindManyCourseByStatusIdQuery): Promise<Course[]> {
		const page = params?.page ?? 1
		const take = params?.limit ?? 20

		const courses = await this.prisma.course.findMany({
			where: { status: { id: statusId } },
			orderBy: {
				createdAt: 'desc',
			},
			take,
			skip: (page - 1) * take,
			include: { category: true, status: true },
		})
		return courses.map(PrismaCourseMapper.toDomain)
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
			include: { category: true, status: true },
		})

		return courses.map(PrismaCourseMapper.toDomain)
	}

	async create(data: Course): Promise<Course> {
		const course = await this.prisma.course.create({
			data: PrismaCourseMapper.toPrismaCreate(data),
			include: { category: true, status: true },
		})

		return PrismaCourseMapper.toDomain(course)
	}

	async save(course: Course): Promise<void> {
		await this.prisma.course.update({
			where: { id: course.id.toString() },
			data: PrismaCourseMapper.toPrismaUpdate(course),
		})
	}

	async remove(course: Course): Promise<void> {
		const data = PrismaCourseMapper.toPrismaCreate(course)

		await this.prisma.course.delete({ where: { id: data.id } })
	}
}
