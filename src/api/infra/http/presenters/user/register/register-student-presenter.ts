import { Student } from '@/api/domain/e-learning/enterprise/entities/student'

export class RegisterStudentPresenter {
	static toHttp(student: Student) {
		return {
			name: student.name,
			email: student.email,
			password: student.passwordHash,
		}
	}
}
