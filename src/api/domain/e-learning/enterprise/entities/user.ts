import { AggregateRoot } from '@/api/core/entities/aggregate-root'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Optional } from '@/api/core/types/optional'
import { UserRole } from './value-objects/user/role'

export interface UserProps {
	name: string
	email: string
	passwordHash: string
	avatarUrl?: string | null
	role?: UserRole
	createdAt: Date
	updatedAt?: Date | null
}

export class User<Props extends UserProps> extends AggregateRoot<Props> {
	get name() {
		return this.props.name
	}

	get email() {
		return this.props.email
	}

	get passwordHash() {
		return this.props.passwordHash
	}

	get avatarUrl() {
		return this.props.avatarUrl ?? null
	}

	get role() {
		return this.props.role
	}

	get createdAt() {
		return this.props.createdAt
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	protected touch() {
		this.props.updatedAt = new Date()
	}

	updateDetails(details: {
		name?: string
		email?: string
		passwordHash?: string
		avatarUrl?: string
	}) {
		let updated = false

		if (details.name && details.name !== this.props.name) {
			if (!details.name || details.name.trim().length === 0) {
				throw new Error('Nome não pode ser vazio')
			}
			this.props.name = details.name
			updated = true
		}

		if (details.email && details.email !== this.props.email) {
			if (!details.email || details.email.trim().length === 0) {
				throw new Error('Email não pode ser vazio')
			}
			this.props.email = details.email
			updated = true
		}

		if (
			details.passwordHash &&
			details.passwordHash !== this.props.passwordHash
		) {
			if (!details.passwordHash || details.passwordHash.trim().length === 0) {
				throw new Error('passwordHash não pode ser vazio')
			}
			this.props.passwordHash = details.passwordHash
			updated = true
		}

		if (details.avatarUrl && details.avatarUrl !== this.props.avatarUrl) {
			this.props.avatarUrl = details.avatarUrl
			updated = true
		}

		if (updated) {
			this.touch()
		}
	}

	protected static createBase(
		props: Optional<UserProps, 'createdAt'>,
		id?: UniqueEntityId,
	) {
		const user = new User(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		)

		return user
	}
}
