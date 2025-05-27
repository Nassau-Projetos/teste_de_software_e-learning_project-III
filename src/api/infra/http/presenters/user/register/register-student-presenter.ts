import { Student } from '@/api/domain/e-learning/enterprise/entities/student'

export class RegisterStudent {
	static toHttp(student: Student) {
		return {
			name: student.name,
			email: student.email,
			password: student.passwordHash,
		}
	}
}
