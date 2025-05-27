import {
	CourseCategorysRepository,
	FindManyCourseCategoriesQuery,
	FindUniqueCourseCategoryQuery,
} from '@/api/domain/e-learning/application/repositories/course-catogories-repository'
import { CourseCategory } from '@/api/domain/e-learning/enterprise/entities/course-category'

export class InMemoryCourseCategorysRepository
	implements CourseCategorysRepository
{
	public items: CourseCategory[] = []

	async findUnique({
		categoryId,
	}: FindUniqueCourseCategoryQuery): Promise<CourseCategory | null> {
		const category = this.items.find(
			(item) => item.id.toNumber() === categoryId,
		)
		return category ?? null
	}

	async findByName(params: { name: string }): Promise<CourseCategory | null> {
		const category = this.items.find((item) => item.name === params.name)
		return category ?? null
	}

	async findMany({
		params,
	}: FindManyCourseCategoriesQuery): Promise<CourseCategory[]> {
		const page = params?.page ?? 1
		const limit = params?.limit ?? 20

		const sorted = this.items.sort((a, b) => b.courseCount - a.courseCount)

		return sorted.slice((page - 1) * limit, page * limit)
	}

	async create(data: CourseCategory): Promise<CourseCategory> {
		this.items.push(data)
		return data
	}

	async save(category: CourseCategory): Promise<void> {
		const index = this.items.findIndex((item) => item.id.equals(category.id))
		if (index >= 0) {
			this.items[index] = category
		}
	}

	async delete(categoryId: number): Promise<void> {
		this.items = this.items.filter((item) => item.id.toNumber() !== categoryId)
	}
}
