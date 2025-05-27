import { Instructor } from '@/api/domain/e-learning/enterprise/entities/instructor'

export class AuthenticateInstructorPresenter {
	static toHttp(instructor: Instructor, token: string) {
		return {
			token,
			user: {
				id: instructor.id.toString(),
				name: instructor.name,
				email: instructor.email,
				role: instructor.role?.key,
			},
		}
	}
}
