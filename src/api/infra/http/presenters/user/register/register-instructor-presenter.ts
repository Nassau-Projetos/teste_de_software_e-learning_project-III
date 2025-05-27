import { Instructor } from '@/api/domain/e-learning/enterprise/entities/instructor'

export class RegisterInstructorPresenter {
	static toHttp(instructor: Instructor) {
		return {
			name: instructor.name,
			email: instructor.email,
			password: instructor.passwordHash,
		}
	}
}
