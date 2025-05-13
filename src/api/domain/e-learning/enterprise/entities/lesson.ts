import { Optional } from '@/api/core/types/optional'
import { Entity } from 'src/api/core/entities/entity'
import { UniqueEntityId } from 'src/api/core/entities/value-objects/unique-entity-id'
import { LessonContent } from './value-objects/lesson/lessonContent'
import { Status } from './value-objects/status'

interface LessonProps {
	title: string
	content: LessonContent
	durationInMinutes: number
	order: number
	resources?: string[]
	moduleId: UniqueEntityId
	status: Status
	createdAt: Date
	updatedAt?: Date | null
	publishedAt?: Date | null
}

export class Lesson extends Entity<LessonProps> {
	get title() {
		return this.props.title
	}

	get content() {
		return this.props.content
	}

	get durationInMinutes() {
		return this.props.durationInMinutes
	}

	get order() {
		return this.props.order
	}

	get moduleId() {
		return this.props.moduleId
	}

	get resources() {
		return this.props.resources ?? []
	}

	get status() {
		return this.props.status
	}

	get createdAt() {
		return this.props.createdAt
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	get publishedAt() {
		return this.props.publishedAt
	}
	set publishedAt(publishedAt: Date | undefined | null) {
		const current = this.props.publishedAt?.getTime()
		const next = publishedAt?.getTime()
		if (current !== next) {
			this.props.publishedAt = publishedAt
			this.touch()
		}
	}

	publish() {
		if (this.props.status.isPublished()) {
			throw new Error('A aula já está publicada')
		}
		this.props.status = Status.PUBLISHED
		this.props.publishedAt = new Date()
		this.touch()
	}

	archive() {
		if (this.props.status.isArchived()) {
			throw new Error('A aula já está arquivada')
		}
		this.props.status = Status.ARCHIVED
		this.touch()
	}

	updateDetails(details: {
		title?: string
		order?: number
		durationInMinutes?: number
		content?: LessonContent
		resources?: string[]
	}) {
		let updated = false

		if (details.title && details.title !== this.props.title) {
			if (!details.title || details.title.trim().length === 0) {
				throw new Error('Título não pode ser vazio')
			}
			this.props.title = details.title
			updated = true
		}

		if (details.order && details.order !== this.props.order) {
			this.props.order = details.order
			updated = true
		}

		if (
			details.durationInMinutes &&
			details.durationInMinutes !== this.props.durationInMinutes
		) {
			this.props.durationInMinutes = details.durationInMinutes
			updated = true
		}

		if (details.content && !details.content.equals(this.props.content)) {
			this.props.content = details.content
			updated = true
		}

		if (
			Array.isArray(details.resources) &&
			JSON.stringify(details.resources) !== JSON.stringify(this.props.resources)
		) {
			this.props.resources = details.resources
			updated = true
		}

		if (updated) {
			this.touch()
		}
	}

	private touch() {
		this.props.updatedAt = new Date()
	}

	static create(
		props: Optional<LessonProps, 'createdAt'>,
		id?: UniqueEntityId,
	) {
		return new Lesson(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		)
	}
}
