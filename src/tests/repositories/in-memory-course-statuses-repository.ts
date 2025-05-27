import {
  CourseStatusesRepository,
  FindUniqueStatusQuery,
} from '@/api/domain/e-learning/application/repositories/course-status-repository'
import { Status } from '@/api/domain/e-learning/enterprise/entities/status'

export class InMemoryCourseStatusesRepository extends CourseStatusesRepository {
	public items: Status[] = []

	async findUnique({
		statusId,
	}: FindUniqueStatusQuery): Promise<Status | null> {
		const status = this.items.find((item) => item.id.toNumber() === statusId)
		return status || null
	}

	async create(data: Status): Promise<Status> {
		this.items.push(data)
		return data
	}
}
