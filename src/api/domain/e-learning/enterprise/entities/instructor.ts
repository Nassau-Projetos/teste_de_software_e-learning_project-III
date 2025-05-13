import { AggregateRoot } from '@/api/core/entities/aggregate-root'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Optional } from '@/api/core/types/optional'
import { Course } from './course'

interface InstructorProps {
	name: string
	bio?: string
	courses?: Course[]
	createdAt: Date
	updatedAt?: Date | null
}

export class Instructor extends AggregateRoot<InstructorProps> {
	get name() {
		return this.props.name
	}

	get bio() {
		return this.props.bio
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

	set bio(newBio: string | undefined) {
		this.props.bio = newBio
		this.touch()
	}

	addCourse(course: Course) {
		const exists = this.courses.find((c) => c.id.equals(course.id))
		if (exists) {
			throw new Error('Curso já associado a este instrutor')
		}

		this.props.courses = [...this.courses, course]
		this.touch()
	}

	removeCourse(courseId: UniqueEntityId) {
		const initialLength = this.courses.length
		this.props.courses = this.courses.filter((c) => !c.id.equals(courseId))

		if (this.courses.length === initialLength) {
			throw new Error('Curso não encontrado para este instrutor')
		}

		this.touch()
	}

	private touch() {
		this.props.updatedAt = new Date()
	}

	static create(
		props: Optional<InstructorProps, 'createdAt' | 'courses'>,
		id?: UniqueEntityId,
	) {
		return new Instructor(
			{
				...props,
				courses: props.courses ?? [],
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		)
	}
}
