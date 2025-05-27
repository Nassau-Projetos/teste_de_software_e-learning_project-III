import { Entity } from '@/api/core/entities/entity'
import { IncrementalEntityId } from '@/api/core/entities/value-objects/incremental-entity-id'
import { STATUS_INFO } from '@/api/core/enums/status'
import { Optional } from '@/api/core/types/optional'

export interface StatusProps {
	createdAt: Date
}

export class Status extends Entity<StatusProps, IncrementalEntityId> {
	get name(): string {
		return STATUS_INFO[this._id.toNumber()]?.label ?? 'Unknown Status'
	}

	get key(): string {
		return STATUS_INFO[this._id.toNumber()]?.key ?? 'UNKNOW'
	}

	get createdAt() {
		return this.props.createdAt
	}

	isPublished(): boolean {
		return this.key === 'PUBLISHED'
	}

	isArchived(): boolean {
		return this.key === 'ARCHIVED'
	}

	isDraft(): boolean {
		return this.key === 'DRAFT'
	}

	static create(
		props: Optional<StatusProps, 'createdAt'>,
		id?: IncrementalEntityId,
	) {
		const status = new Status(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
			() => new IncrementalEntityId(),
		)

		return status
	}
}
