import { IncrementalEntityId } from '@/api/core/entities/value-objects/incremental-entity-id'
import { CATEGORY } from '@/api/core/enums/category'

export class CourseCategory extends IncrementalEntityId {
	static TI = new CourseCategory(CATEGORY.TI)
	static DESIGN = new CourseCategory(CATEGORY.DESIGN)
	static LANGUAGES = new CourseCategory(CATEGORY.LANGUAGES)
	static MARKETING = new CourseCategory(CATEGORY.MARKETING)
	static BUSINESS = new CourseCategory(CATEGORY.BUSINESS)

	static fromValue(value: CATEGORY | number | string): CourseCategory {
		switch (value) {
			case CATEGORY.TI:
			case 'TI':
			case 1:
				return CourseCategory.TI

			case CATEGORY.DESIGN:
			case 'DESIGN':
			case 2:
				return CourseCategory.DESIGN

			case CATEGORY.LANGUAGES:
			case 'LANGUAGES':
			case 3:
				return CourseCategory.LANGUAGES

			case CATEGORY.BUSINESS:
			case 'MARKETING':
			case 4:
				return CourseCategory.MARKETING

			case CATEGORY.MARKETING:
			case 'BUSINESS':
			case 5:
				return CourseCategory.BUSINESS

			default:
				throw new Error(`Nível de curso inválido: ${value}`)
		}
	}
}
