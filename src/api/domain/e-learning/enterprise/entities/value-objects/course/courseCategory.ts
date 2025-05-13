import { IncrementalEntityId } from '@/api/core/entities/value-objects/incremental-entity-id'
import { CATEGORY } from '@/api/core/enums/category'

export class CourseCategory extends IncrementalEntityId {
	static TI = new CourseCategory(CATEGORY.TI)
	static DESIGN = new CourseCategory(CATEGORY.DESIGN)
	static LANGUAGES = new CourseCategory(CATEGORY.LANGUAGES)
	static MARKETING = new CourseCategory(CATEGORY.MARKETING)
	static BUSINESS = new CourseCategory(CATEGORY.BUSINESS)
}
