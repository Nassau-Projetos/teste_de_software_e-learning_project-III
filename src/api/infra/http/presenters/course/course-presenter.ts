import { Course } from '@/api/domain/e-learning/enterprise/entities/course'

export class CoursePresenter {
	static toHttp(course: Course) {
		return {
			id: course.id.toString(),
			title: course.title,
			rating: course.rating.average,
			reviewCount: course.rating.count,
			price: course.price.value.toString(),
			discountPrice: course.discount?.percentage,
			thumbnailUrl: course.thumbnailUrl,
			category: course.category.name,
			studentsCount: course.studentsCount,
			updatedAt: course.updatedAt?.toISOString(),
		}
	}
}
