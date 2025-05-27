import { Student } from '@/api/domain/e-learning/enterprise/entities/student'

export class StudentProfilePresenter {
	static toHttp(student: Student) {
		return {
			id: student.id.toString(),
			name: student.name,
			email: student.email,
			phoneNumber: student.phoneNumber,
			avatarUrl: student.avatarUrl,
			enrollments: student.enrollments.map((enrollment) => ({
				courseId: enrollment.courseId,
				status: enrollment.status.value,
				progress: enrollment.progress,
				paymentId: enrollment.paymentId?.toString(),
				requestAT: enrollment.requestAt.toISOString(),
				enrolledAt: enrollment.enrolledAt?.toISOString(),
				canceledAt: enrollment.canceledAt?.toISOString(),
				completedAt: enrollment.completedAt?.toISOString(),
			})),
		}
	}
}
