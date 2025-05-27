import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import {
	Student,
	StudentProps,
} from '@/api/domain/e-learning/enterprise/entities/student'
import { UserRole } from '@/api/domain/e-learning/enterprise/entities/value-objects/user/role'
import { faker } from '@faker-js/faker'

export function makeStudent(
	override: Partial<StudentProps> = {},
	id?: UniqueEntityId,
) {
	const student = Student.create(
		{
			name: faker.person.fullName(),
			cpf: faker.string.numeric(11),
			email: faker.internet.email(),
			passwordHash: faker.internet.password(),
			avatarUrl: faker.image.avatar(),
			phoneNumber: faker.phone.number({ style: 'international' }),
			role: UserRole.STUDENT,
			...override,
		},
		id,
	)
	return student
}
