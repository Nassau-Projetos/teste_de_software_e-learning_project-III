import { Student } from '@/api/domain/e-learning/enterprise/entities/student'

export class StudentPresenter {
	static toHttp(student: Student) {
		return {
			id: student.id.toString(),
			name: student.name,
			email: student.email,
			avatarUrl: student.avatarUrl,
		}
	}
}
