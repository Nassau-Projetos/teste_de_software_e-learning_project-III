import { Entity } from '@/api/core/entities/entity'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Optional } from '@/api/core/types/optional'

export interface CourseRatingProps {
	courseId: UniqueEntityId
	studentId: UniqueEntityId
	value: number
	comment?: string
	createdAt: Date
	updatedAt?: Date | null
}

export class CourseRating extends Entity<CourseRatingProps> {
	get courseId() {
		return this.props.courseId
	}

	get studentId() {
		return this.props.studentId
	}

	get value() {
		return this.props.value
	}

	get comment() {
		return this.props.comment
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

	updateRating(value: number, comment?: string) {
		if (value < 1 || value > 5) {
			throw new Error('A nota da avaliação deve estar entre 1 e 5.')
		}

		this.props.value = value
		this.props.comment = comment
		this.touch()
	}

	static create(
		props: Optional<CourseRatingProps, 'createdAt'>,
		id?: UniqueEntityId,
	) {
		if (props.value < 1 || props.value > 5) {
			throw new Error('A nota da avaliação deve estar entre 1 e 5.')
		}

		return new CourseRating(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		)
	}
}
