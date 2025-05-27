import { IncrementalEntityId } from '@/api/core/entities/value-objects/incremental-entity-id'
import { STATUS } from '@/api/core/enums/status'
import { Status } from '@/api/domain/e-learning/enterprise/entities/status'

export function makeCourseStatus(statusId: STATUS = STATUS.DRAFT): Status {
	return Status.create({}, new IncrementalEntityId(statusId))
}
