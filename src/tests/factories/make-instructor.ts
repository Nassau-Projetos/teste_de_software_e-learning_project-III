import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import {
	Instructor,
	InstructorProps,
} from '@/api/domain/e-learning/enterprise/entities/instructor'
import { UserRole } from '@/api/domain/e-learning/enterprise/entities/value-objects/user/role'
import { faker } from '@faker-js/faker'

export function makeInstructor(
	override: Partial<InstructorProps> = {},
	id?: UniqueEntityId,
) {
	const instructor = Instructor.create(
		{
			name: faker.person.fullName(),
			bio: faker.person.bio(),
			cpf: faker.string.numeric(11),
			email: faker.internet.email(),
			passwordHash: faker.internet.password(),
			avatarUrl: faker.image.avatar(),
			phoneNumber: faker.phone.number({ style: 'international' }),
			role: UserRole.INSTRUCTOR,
			...override,
		},
		id,
	)
	return instructor
}
