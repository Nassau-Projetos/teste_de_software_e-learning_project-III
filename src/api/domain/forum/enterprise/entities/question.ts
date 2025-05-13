import { AggregateRoot } from '@/api/core/entities/aggregate-root'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Optional } from '@/api/core/types/optional'
import { Slug } from '@/api/domain/e-learning/enterprise/entities/value-objects/slug/slug'
import dayjs from 'dayjs'
import { QuestionAttachmentList } from './question-attachment-list'

export interface QuestionProps {
	authorId: UniqueEntityId
	bestAnswerId?: UniqueEntityId | null
	title: string
	content: string
	slug: Slug
	attachments: QuestionAttachmentList
	createdAt: Date
	updatedAt?: Date | null
}

export class Question extends AggregateRoot<QuestionProps> {
	get authorId() {
		return this.props.authorId
	}

	get bestAnswerId() {
		return this.props.bestAnswerId
	}

	get title(): string {
		return this.props.title
	}

	get content(): string {
		return this.props.content
	}

	get slug() {
		return this.props.slug
	}

	get attachments() {
		return this.props.attachments
	}

	get createdAt() {
		return this.props.createdAt
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	get isNew(): boolean {
		return dayjs().diff(this.createdAt, 'days') <= 3
	}

	get except() {
		return this.content.substring(0, 120).trimEnd().concat('...')
	}

	private touch() {
		this.props.updatedAt = new Date()
	}

	set title(title: string) {
		this.props.title = title
		this.props.slug = Slug.createFromText(title)
		this.touch()
	}

	set content(content: string) {
		this.props.content = content
		this.touch()
	}

	set attachments(attachments: QuestionAttachmentList) {
		this.props.attachments = attachments
		this.touch()
	}

	set bestAnswerId(bestAnswerId: UniqueEntityId | undefined | null) {
		this.props.bestAnswerId = bestAnswerId
		this.touch()
	}

	static create(
		props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
		id?: UniqueEntityId,
	) {
		const question = new Question(
			{
				...props,
				slug: props.slug ?? Slug.createFromText(props.title),
				attachments: props.attachments ?? new QuestionAttachmentList(),
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		)

		return question
	}
}
