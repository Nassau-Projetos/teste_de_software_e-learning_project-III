import {
	FindUniqueStudentQuery,
	StudentsRepository,
} from '@/api/domain/e-learning/application/repositories/students-repository'
import { Student } from '@/api/domain/e-learning/enterprise/entities/student'
import { Injectable } from '@nestjs/common'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaStudentRepository implements StudentsRepository {
	constructor(private prisma: PrismaService) {}

	async findUnique({
		studentId,
	}: FindUniqueStudentQuery): Promise<Student | null> {
		const student = await this.prisma.student.findUnique({
			where: { id: studentId },
			include: { user: true, enrollments: true },
		})

		if (!student) return null

		return PrismaStudentMapper.toDomain(student)
	}

	async findByEmail({
		email,
	}: FindUniqueStudentQuery): Promise<Student | null> {
		const student = await this.prisma.student.findFirst({
			where: {
				user: {
					email,
				},
			},
			include: {
				user: true,
				enrollments: true,
			},
		})

		if (!student) return null

		return PrismaStudentMapper.toDomain(student)
	}

	async create(student: Student): Promise<void> {
		await this.prisma.student.create({
			data: PrismaStudentMapper.toPrismaCreate(student),
		})
	}

	async save(student: Student): Promise<void> {
		await this.prisma.student.update({
			where: { id: student.id.toString() },
			data: PrismaStudentMapper.toPrismaUpdate(student),
		})
	}

	async remove(student: Student): Promise<void> {
		const data = PrismaStudentMapper.toPrismaCreate(student)

		await this.prisma.student.delete({ where: { id: data.id } })
	}
}
