import { Instructor } from '@/api/domain/e-learning/enterprise/entities/instructor'

export class InstructorPresenter {
	static toHttp(instructor: Instructor) {
		return {
			id: instructor.id.toString(),
			name: instructor.name,
			bio: instructor.bio,
			avatarUrl: instructor.avatarUrl,
			courses: instructor.courses.map((course) => ({
				title: course.title,
				rating: course.rating.average,
				reviewCount: course.rating.count,
				price: course.price.value.toString(),
				discountPrice: course.discount?.percentage,
				thumbnailUrl: course.thumbnailUrl,
				category: course.category.name,
				studentsCount: course.studentsCount,
				updatedAt: course.updatedAt?.toISOString(),
			})),
		}
	}
}
