import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Optional } from '@/api/core/types/optional'
import { Course } from './course'
import { User, UserProps } from './user'
import { UserRole } from './value-objects/user/role'

export interface InstructorProps extends UserProps {
	name: string
	bio?: string | null
	cpf: string
	phoneNumber?: string | null
	courses?: Course[]
	createdAt: Date
	updatedAt?: Date | null
}

export class Instructor extends User<InstructorProps> {
	get name() {
		return this.props.name
	}

	get bio() {
		return this.props.bio ?? null
	}

	get cpf() {
		return this.props.cpf
	}

	get phoneNumber() {
		return this.props.phoneNumber ?? null
	}

	get courses(): Course[] {
		return this.props.courses ?? []
	}

	get createdAt() {
		return this.props.createdAt
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	addCourse(course: Course) {
		const exists = this.courses.find((c) => c.id.equals(course.id))
		if (exists) {
			throw new Error('Curso já associado a este instrutor')
		}

		this.props.courses = [...this.courses, course]
		this.touch()
	}

	removeCourse(course: Course) {
		const initialLength = this.courses.length
		this.props.courses = this.courses.filter((c) => !c.id.equals(course.id))

		if (this.courses.length === initialLength) {
			throw new Error('Curso não encontrado para este instrutor')
		}

		this.touch()
	}

	updateDetails(details: {
		name?: string
		bio?: string
		phoneNumber?: string
		email?: string
		passwordHash?: string
	}) {
		let updated = false

		if (details.name && details.name !== this.props.name) {
			if (!details.name || details.name.trim().length === 0) {
				throw new Error('Nome não pode ser vazio')
			}
			this.props.name = details.name
			updated = true
		}

		if (details.bio && details.bio !== this.props.bio) {
			this.props.bio = details.bio
			updated = true
		}

		if (details.phoneNumber && details.phoneNumber !== this.props.phoneNumber) {
			this.props.phoneNumber = details.phoneNumber
			updated = true
		}

		if (details.email && details.email !== this.props.email) {
			this.props.email = details.email
			updated = true
		}

		if (
			details.passwordHash &&
			details.passwordHash !== this.props.passwordHash
		) {
			this.props.passwordHash = details.passwordHash
			updated = true
		}

		this.updateUserDetailsBase(details)
		if (updated) {
			this.touch()
		}
	}

	static create(
		props: Optional<InstructorProps, 'createdAt' | 'courses' | 'role'>,
		id?: UniqueEntityId,
	) {
		return new Instructor(
			{
				...props,
				courses: props.courses ?? [],
				role: UserRole.INSTRUCTOR,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
			() => new UniqueEntityId(),
		)
	}
}
