import { AggregateRoot } from '@/api/core/entities/aggregate-root'
import { UniqueEntityId } from 'src/api/core/entities/value-objects/unique-entity-id'
import { Optional } from 'src/api/core/types/optional'
import { CourseModule } from './courseModule'
import { CourseCategory } from './value-objects/course/courseCategory'
import { CourseLevel } from './value-objects/course/courseLevel'
import { Price } from './value-objects/price'
import { Slug } from './value-objects/slug/slug'
import { Status } from './value-objects/status'

interface CourseProps {
	title: string
	description?: string | null
	slug: Slug
	thumbnailUrl: string
	duration: number
	price: Price
	status: Status
	instructorId: UniqueEntityId
	modules: CourseModule[]
	category: CourseCategory
	level: CourseLevel
	createdAt: Date
	updatedAt?: Date | null
	publishedAt?: Date | null
}

export class Course extends AggregateRoot<CourseProps> {
	get title() {
		return this.props.title
	}

	get description() {
		return this.props.description || null
	}

	get slug() {
		return this.props.slug
	}

	get thumbnailUrl() {
		return this.props.thumbnailUrl
	}

	get price() {
		return this.props.price
	}

	get duration() {
		return this.props.duration
	}

	get instructorId() {
		return this.props.instructorId
	}

	get modules() {
		return this.props.modules
	}

	get category() {
		return this.props.category
	}

	get status() {
		return this.props.status
	}

	get level() {
		return this.props.level
	}

	get createdAt() {
		return this.props.createdAt
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	get publishedAt() {
		return this.props.publishedAt || null
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
			throw new Error('Curso já está publicado')
		}
		this.props.status = Status.PUBLISHED
		this.props.publishedAt = new Date()
		this.touch()
	}

	archive() {
		if (this.props.status.isArchived()) {
			throw new Error('Curso já está arquivado')
		}
		this.props.status = Status.ARCHIVED
		this.touch()
	}

	updateDetails(details: {
		title?: string
		description?: string
		duration?: number
		thumbnailUrl?: string
	}) {
		let updated = false

		if (details.title && details.title !== this.props.title) {
			if (!details.title || details.title.trim().length === 0) {
				throw new Error('Título não pode ser vazio')
			}
			this.props.title = details.title
			this.props.slug = Slug.createFromText(details.title)
			updated = true
		}

		if (details.description && details.description !== this.props.description) {
			this.props.description = details.description
			updated = true
		}

		if (details.duration && details.duration !== this.props.duration) {
			this.props.duration = details.duration
			updated = true
		}

		if (
			details.thumbnailUrl &&
			details.thumbnailUrl !== this.props.thumbnailUrl
		) {
			this.props.thumbnailUrl = details.thumbnailUrl
			updated = true
		}

		if (updated) {
			this.touch()
		}
	}

	addModule(module: CourseModule) {
		const exists = this.modules.find((m) => m.id.equals(module.id))
		if (exists) {
			throw new Error('Módulo já adicionado ao curso')
		}

		if (module.order == null) {
			module.updateDetails({ order: this.modules.length })
		}
		this.props.modules = [...this.modules, module]
		this.touch()
	}

	removeModule(moduleId: UniqueEntityId) {
		const initialLength = this.modules.length
		this.props.modules = this.modules.filter(
			(module) => !module.id.equals(moduleId),
		)

		if (this.modules.length === initialLength) {
			throw new Error('Módulo não encontrado neste curso')
		}

		this.touch()
	}

	reorderModules(orderMap: Record<string, number>) {
		let changed = false
		const newOrders = Object.values(orderMap)

		if (new Set(newOrders).size !== newOrders.length) {
			throw new Error('Ordem dos módulos contém duplicatas')
		}

		if (newOrders.some((order) => order < 0)) {
			throw new Error('Ordem dos módulos não pode ser negativa')
		}

		const updatedModules = this.modules.map((module) => {
			const newOrder = orderMap[module.id.toString()]
			if (newOrder !== undefined && module.order !== newOrder) {
				module.updateDetails({ order: newOrder })
				changed = true
			}
			return module
		})

		if (changed) {
			this.props.modules = updatedModules.sort((a, b) => a.order - b.order)
			this.touch()
		}
	}

	makeFree() {
		if (this.props.price.isFree()) {
			throw new Error('O curso já é gratuito')
		}
		this.props.price = Price.free()
		this.touch()
	}

	changePrice(newPrice: Price) {
		if (!this.props.price.equals(newPrice)) {
			this.props.price = newPrice
			this.touch()
		}
	}

	changeLevel(newLevel: CourseLevel) {
		if (!this.props.level.equals(newLevel)) {
			this.props.level = newLevel
			this.touch()
		}
	}

	changeCategory(newCategory: CourseCategory) {
		if (!this.props.category.equals(newCategory)) {
			this.props.category = newCategory
			this.touch()
		}
	}

	private touch() {
		this.props.updatedAt = new Date()
	}

	static create(
		props: Optional<CourseProps, 'createdAt' | 'slug' | 'status'>,
		id?: UniqueEntityId,
	) {
		const course = new Course(
			{
				...props,
				slug: props.slug ?? Slug.createFromText(props.title),
				status: props.status ?? Status.DRAFT,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		)

		return course
	}
}
