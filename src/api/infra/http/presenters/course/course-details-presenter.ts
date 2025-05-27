import { Course } from '@/api/domain/e-learning/enterprise/entities/course'

export class CourseDetailsPresenter {
	static toHttp(course: Course, instructorName: string) {
		return {
			id: course.id.toString(),
			title: course.title,
			description: course.description,
			instructor: instructorName,
			rating: course.rating.average,
			reviewCount: course.rating.count,
			price: course.price.value,
			discountPrice: course.discount?.percentage,
			thumbnailUrl: course.thumbnailUrl,
			category: course.category.name,
			duration: course.duration,
			level: course.level.label,
			students: course.studentsCount,
			lastUpdate: course.updatedAt?.toISOString(),
			modules: course.modules.map((module) => ({
				title: module.title,
			})),
		}
	}
}
