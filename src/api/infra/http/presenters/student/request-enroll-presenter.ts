import { Enrollment } from '@/api/domain/e-learning/enterprise/entities/enrollment'

export class RequestEnrollStudentPresenter {
	static toHttp(enrollment: Enrollment) {
		return {
			id: enrollment.id.toString(),
			studentId: enrollment.studentId.toString(),
			courseId: enrollment.courseId.toString(),
			status: enrollment.status.value,
			requestAt: enrollment.requestAt.toISOString(),
		}
	}
}
