import { Student } from '@/api/domain/e-learning/enterprise/entities/student'

export class AuthenticateStudentPresenter {
	static toHttp(student: Student, token: string) {
		return {
			token,
			user: {
				id: student.id.toString(),
				name: student.name,
				email: student.email,
				role: student.role?.key,
			},
		}
	}
}
