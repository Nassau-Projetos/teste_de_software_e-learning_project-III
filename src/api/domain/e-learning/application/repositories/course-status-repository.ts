import { Status } from '../../enterprise/entities/status'

export abstract class CourseStatusesRepository {
	abstract findUnique(query: FindUniqueStatusQuery): Promise<Status | null>
	abstract create(data: Status): Promise<Status>
}

export abstract class FindUniqueStatusQuery {
	abstract statusId?: number
	abstract name?: string
}
