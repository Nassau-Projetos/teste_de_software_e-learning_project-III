import {
	CoursesRepository,
	FindManyCourseByCategoryIdQuery,
	FindManyCourseByStatusIdQuery,
	FindUniqueCourseQuery,
} from '@/api/domain/e-learning/application/repositories/courses-repository'
import { Course } from '@/api/domain/e-learning/enterprise/entities/course'

export class InMemoryCoursesRepository implements CoursesRepository {
	public items: Course[] = []

	async findUnique({
		courseId,
	}: FindUniqueCourseQuery): Promise<Course | null> {
		const course = this.items.find((item) => item.id.toString() === courseId)
		return course || null
	}

	async findBySlug({ slug }: FindUniqueCourseQuery): Promise<Course | null> {
		const course = this.items.find((item) => item.slug.value === slug)
		return course || null
	}

	async findManyByCategoryId({
		categoryId,
		params,
	}: FindManyCourseByCategoryIdQuery): Promise<Course[]> {
		const page = params?.page ?? 1
		const limit = params?.limit ?? 20

		const filtered = this.items.filter((item) => {
			return item.category.id.toNumber() === categoryId
		})

		const sorted = filtered.sort(
			(a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
		)

		return sorted.slice((page - 1) * limit, page * limit)
	}

	async findManyRecent({
		statusId,
		params,
	}: FindManyCourseByStatusIdQuery): Promise<Course[]> {
		const page = params?.page ?? 1
		const limit = params?.limit ?? 20

		const filtered = this.items.filter((item) => {
			return item.status.id.toNumber() === statusId
		})

		const sorted = filtered.sort(
			(a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
		)

		return sorted.slice((page - 1) * limit, page * limit)
	}

	async create(course: Course): Promise<Course> {
		this.items.push(course)
		return course
	}

	async save(course: Course): Promise<void> {
		const index = this.items.findIndex(
			(item) => item.id.toString() === course.id.toString(),
		)
		if (index >= 0) {
			this.items[index] = course
		}
	}

	async remove(course: Course): Promise<void> {
		const index = this.items.findIndex(
			(item) => item.id.toString() === course.id.toString(),
		)
		if (index >= 0) {
			this.items.splice(index, 1)
		}
	}
}
