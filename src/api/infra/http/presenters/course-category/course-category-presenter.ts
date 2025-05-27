import { CourseCategory } from '@/api/domain/e-learning/enterprise/entities/course-category'

export class CourseCategoryPresenter {
	static toHttp(courseCategory: CourseCategory) {
		return {
			id: courseCategory.id.toNumber(),
			name: courseCategory.name,
			icon: courseCategory.icon,
			courseCount: courseCategory.courseCount,
		}
	}
}
