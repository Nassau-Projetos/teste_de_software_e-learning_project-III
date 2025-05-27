import {
	FindManyInstructorsQuery,
	FindUniqueInstructorQuery,
	InstructorsRepository,
} from '@/api/domain/e-learning/application/repositories/instructors-repository'
import { Instructor } from '@/api/domain/e-learning/enterprise/entities/instructor'
import { Injectable } from '@nestjs/common'
import { PrismaInstructorMapper } from '../mappers/prisma-instructor-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaInstructorRepository implements InstructorsRepository {
	constructor(private prisma: PrismaService) {}

	async findUnique({
		instructorId,
	}: FindUniqueInstructorQuery): Promise<Instructor | null> {
		const instructor = await this.prisma.instructor.findUnique({
			where: { id: instructorId },
			include: {
				user: true,
				courses: {
					include: {
						category: true,
					},
				},
			},
		})

		if (!instructor) return null

		return PrismaInstructorMapper.toDomain(instructor)
	}

	async findByEmail({
		email,
	}: FindUniqueInstructorQuery): Promise<Instructor | null> {
		const instructor = await this.prisma.instructor.findFirst({
			where: {
				user: {
					email,
				},
			},
			include: {
				user: true,
				courses: {
					include: {
						category: true,
					},
				},
			},
		})

		if (!instructor) return null

		return PrismaInstructorMapper.toDomain(instructor)
	}

	async findMany({ params }: FindManyInstructorsQuery): Promise<Instructor[]> {
		const page = params?.page ?? 1
		const take = params?.limit ?? 20

		const instructors = await this.prisma.instructor.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				user: true,
				courses: {
					include: {
						category: true,
					},
				},
			},
			take,
			skip: (page - 1) * take,
		})

		return instructors.map(PrismaInstructorMapper.toDomain)
	}

	async create(instructor: Instructor): Promise<void> {
		await this.prisma.instructor.create({
			data: PrismaInstructorMapper.toPrisma(instructor),
		})
	}

	async save(instructor: Instructor): Promise<void> {
		const data = PrismaInstructorMapper.toPrismaUpdate(instructor)

		await this.prisma.instructor.update({
			where: { id: instructor.id.toString() },
			data,
		})
	}

	async remove(instructor: Instructor): Promise<void> {
		const data = PrismaInstructorMapper.toPrisma(instructor)

		await this.prisma.instructor.delete({ where: { id: data.id } })
	}
}
