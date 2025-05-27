import { Entity } from '@/api/core/entities/entity'
import { IncrementalEntityId } from '@/api/core/entities/value-objects/incremental-entity-id'
import { CATEGORY_INFO } from '@/api/core/enums/category'
import { Optional } from '@/api/core/types/optional'

export interface CourseCategoryProps {
	icon: string
	courseCount: number
	createdAt: Date
	updatedAt?: Date | null
}

export class CourseCategory extends Entity<
	CourseCategoryProps,
	IncrementalEntityId
> {
	get name(): string {
		return CATEGORY_INFO[this._id.toNumber()]?.label ?? 'Categoria desconhecida'
	}

	get key(): string {
		return CATEGORY_INFO[this._id.toNumber()]?.key ?? 'UNKNOWN'
	}

	get icon() {
		return this.props.icon
	}

	get courseCount() {
		return this.props.courseCount
	}

	get createdAt() {
		return this.props.createdAt
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	private touch() {
		this.props.updatedAt = new Date()
	}

	incrementCourseCount() {
		this.props.courseCount++
		this.touch()
	}

	decrementCourseCount() {
		if (this.props.courseCount > 0) {
			this.props.courseCount--
			this.touch()
		}
	}

	updateDetails(details: { icon?: string }) {
		let updated = false

		if (details.icon && details.icon !== this.props.icon) {
			this.props.icon = details.icon
			updated = true
		}

		if (updated) {
			this.touch()
		}
	}

	static create(
		props: Optional<CourseCategoryProps, 'createdAt' | 'courseCount'>,
		id?: IncrementalEntityId,
	) {
		const category = new CourseCategory(
			{
				...props,
				courseCount: props.courseCount ?? 0,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
			() => new IncrementalEntityId(),
		)

		return category
	}
}
