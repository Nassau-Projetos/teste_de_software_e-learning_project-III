import { Entity } from '@/api/core/entities/entity'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'

interface AttachmentProps {
	title: string
	link: string
}

export class Attachment extends Entity<AttachmentProps> {
	get title() {
		return this.props.title
	}

	get link() {
		return this.props.link
	}

	static create(props: AttachmentProps, id?: UniqueEntityId) {
		const attachment = new Attachment(props, id)

		return attachment
	}
}
