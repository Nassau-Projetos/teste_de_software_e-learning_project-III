import { IncrementalEntityId } from '@/api/core/entities/value-objects/incremental-entity-id'
import { STATUS } from '@/api/core/enums/status'

export class Status extends IncrementalEntityId {
	static DRAFT = new Status(STATUS.DRAFT)
	static PUBLISHED = new Status(STATUS.PUBLISHED)
	static ARCHIVED = new Status(STATUS.ARCHIVED)

	isDraft(): boolean {
		return this.equals(Status.DRAFT)
	}

	isPublished(): boolean {
		return this.equals(Status.PUBLISHED)
	}

	isArchived(): boolean {
		return this.equals(Status.ARCHIVED)
	}
}
