import {
	EnrollmentsRepository,
	FindUniqueEnrollmentQuery,
} from '@/api/domain/e-learning/application/repositories/enrollment-repository'
import { Enrollment } from '@/api/domain/e-learning/enterprise/entities/enrollment'
import { Injectable } from '@nestjs/common'
import { PrismaEnrollmentMapper } from '../mappers/prisma-enrollment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaEnrollmentRepository implements EnrollmentsRepository {
	constructor(private prisma: PrismaService) {}

	async findUnique({
		studentId,
	}: FindUniqueEnrollmentQuery): Promise<Enrollment | null> {
		const enrollment = await this.prisma.enrollment.findUnique({
			where: { id: studentId },
		})

		if (!enrollment) return null

		return PrismaEnrollmentMapper.toDomain(enrollment)
	}

	async create(enrollment: Enrollment): Promise<void> {
		await this.prisma.enrollment.create({
			data: PrismaEnrollmentMapper.toPrisma(enrollment),
		})
	}

	async save(enrollment: Enrollment): Promise<void> {
		const data = PrismaEnrollmentMapper.toPrisma(enrollment)

		await this.prisma.enrollment.update({ where: { id: data.id }, data })
	}
}
