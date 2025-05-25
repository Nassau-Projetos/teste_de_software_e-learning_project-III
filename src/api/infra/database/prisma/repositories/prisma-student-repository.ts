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
			include: { user: true },
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
			},
		})

		if (!student) return null

		return PrismaStudentMapper.toDomain(student)
	}

	async create(student: Student): Promise<void> {
		await this.prisma.student.create({
			data: PrismaStudentMapper.toPrisma(student),
		})
	}

	async save(student: Student): Promise<void> {
		const data = PrismaStudentMapper.toPrisma(student)

		await this.prisma.student.update({ where: { id: data.id }, data })
	}

	async remove(student: Student): Promise<void> {
		const data = PrismaStudentMapper.toPrisma(student)

		await this.prisma.student.delete({ where: { id: data.id } })
	}
}
