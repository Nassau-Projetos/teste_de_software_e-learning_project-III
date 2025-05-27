import { CourseModulesRepository } from '@/api/domain/e-learning/application/repositories/course-modules-repository'
import { CourseModule } from '@/api/domain/e-learning/enterprise/entities/course-module'

export class InMemoryCourseModulesRepository
	implements CourseModulesRepository
{
	public items: CourseModule[] = []

	async findById(moduleId: string): Promise<CourseModule | null> {
		const module = this.items.find((item) => item.id.toString() === moduleId)

		return module ?? null
	}

	async findByCourseId(courseId: string): Promise<CourseModule[]> {
		return this.items.filter((item) => item.courseId.toString() === courseId)
	}

	async create(courseModule: CourseModule): Promise<void> {
		this.items.push(courseModule)
	}

	async save(courseModule: CourseModule): Promise<void> {
		const index = this.items.findIndex(
			(item) => item.id.toString() === courseModule.id.toString(),
		)

		if (index >= 0) {
			this.items[index] = courseModule
		}
	}

	async delete(moduleId: string): Promise<void> {
		const index = this.items.findIndex(
			(item) => item.id.toString() === moduleId,
		)

		if (index >= 0) {
			this.items.splice(index, 1)
		}
	}
}
