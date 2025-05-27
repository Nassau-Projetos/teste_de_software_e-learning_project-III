import {
	CourseStatusesRepository,
	FindUniqueStatusQuery,
} from '@/api/domain/e-learning/application/repositories/course-status-repository'
import { Status } from '@/api/domain/e-learning/enterprise/entities/status'
import { Injectable } from '@nestjs/common'
import { PrismaCourseStatusMapper } from '../mappers/prisma-status-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaStatusRepository implements CourseStatusesRepository {
	constructor(private prisma: PrismaService) {}

	async findUnique({
		statusId,
	}: FindUniqueStatusQuery): Promise<Status | null> {
		const courseStatus = await this.prisma.courseStatus.findUnique({
			where: { id: statusId },
		})

		if (!courseStatus) return null

		return PrismaCourseStatusMapper.toDomain(courseStatus)
	}

	async create(data: Status): Promise<Status> {
		const createdStatus = await this.prisma.courseStatus.create({
			data: PrismaCourseStatusMapper.toPrisma(data),
		})
		return PrismaCourseStatusMapper.toDomain(createdStatus)
	}
}
