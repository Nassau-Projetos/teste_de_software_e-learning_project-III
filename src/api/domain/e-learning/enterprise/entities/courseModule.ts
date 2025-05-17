import { AggregateRoot } from '@/api/core/entities/aggregate-root'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Optional } from '@/api/core/types/optional'
import { Lesson } from './lesson'
import { Quiz } from './quiz'
import { Status } from './value-objects/status'

interface CourseModuleProps {
	title: string
	description?: string
	order: number
	status: Status
	courseId: UniqueEntityId
	quiz?: Quiz | null
	lessons?: Lesson[]
	createdAt: Date
	updatedAt?: Date | null
	publishedAt?: Date | null
}

export class CourseModule extends AggregateRoot<CourseModuleProps> {
	get title() {
		return this.props.title
	}

	get description() {
		return this.props.description
	}

	get order() {
		return this.props.order
	}

	get status() {
		return this.props.status
	}

	get courseId() {
		return this.props.courseId
	}

	get quiz(): Quiz | null | undefined {
		return this.props.quiz
	}

	get lessons(): Lesson[] {
		return this.props.lessons ?? []
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

	attachQuiz(quiz: Quiz) {
		if (this.props.quiz) {
			throw new Error('Este módulo já possui um quiz')
		}
		this.props.quiz = quiz
		this.touch()
	}

	detachQuiz() {
		if (!this.props.quiz) {
			throw new Error('Este módulo não possui quiz para remover')
		}
		this.props.quiz = null
		this.touch()
	}

	hasQuiz() {
		return !!this.props.quiz
	}

	addLesson(lesson: Lesson) {
		const exists = this.lessons.find((l) => l.id.equals(lesson.id))
		if (exists) {
			throw new Error('Aula já adicionada ao módulo')
		}

		this.props.lessons = [...this.lessons, lesson]
		this.touch()
	}

	removeLesson(lessonId: UniqueEntityId) {
		const initialLength = this.lessons.length
		this.props.lessons = this.lessons.filter((l) => !l.id.equals(lessonId))

		if (this.lessons.length === initialLength) {
			throw new Error('Aula não encontrada neste módulo')
		}

		this.touch()
	}

	reorderLessons(orderMap: Record<string, number>) {
		let changed = false

		const updatedLessons = this.lessons.map((lesson) => {
			const newOrder = orderMap[lesson.id.toString()]
			if (newOrder !== undefined && lesson.order !== newOrder) {
				lesson.updateDetails({ order: newOrder })
				changed = true
			}
			return lesson
		})

		if (changed) {
			this.props.lessons = updatedLessons.sort((a, b) => a.order - b.order)
			this.touch()
		}
	}

	publish() {
		if (this.props.status.isPublished()) {
			throw new Error('Módulo já está publicado')
		}
		this.props.status = Status.PUBLISHED
		this.props.publishedAt = new Date()
		this.touch()
	}

	unpublish() {
		if (this.props.status.isPublished()) {
			this.props.status = Status.DRAFT
			this.props.publishedAt = null
			this.touch()
		} else {
			throw new Error('Módulo não está publicado, não pode ser despublicado')
		}
	}

	archive() {
		if (this.props.status.isArchived()) {
			throw new Error('Módulo já está arquivado')
		}
		this.props.status = Status.ARCHIVED
		this.touch()
	}

	updateDetails(details: {
		title?: string
		description?: string
		order?: number
	}) {
		let updated = false

		if (details.title && details.title !== this.props.title) {
			if (!details.title || details.title.trim().length === 0) {
				throw new Error('Título não pode ser vazio')
			}
			this.props.title = details.title
			updated = true
		}

		if (details.description && details.description !== this.props.description) {
			if (details.description.trim().length === 0) {
				throw new Error('Descrição não pode ser vazia')
			}
			this.props.description = details.description
			updated = true
		}

		if (details.order && details.order !== this.props.order) {
			this.props.order = details.order
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
		props: Optional<
			CourseModuleProps,
			'createdAt' | 'lessons' | 'quiz' | 'status'
		>,
		id?: UniqueEntityId,
	) {
		return new CourseModule(
			{
				...props,
				lessons: props.lessons ?? [],
				quiz: props.quiz ?? null,
				status: props.status ?? Status.DRAFT,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		)
	}
}
