import { PrismaClient } from '@prisma/client'
import userData from '../seeds/data/user.json'

export async function seedUser(prisma: PrismaClient) {
	const values = userData
		.map(
			(user) =>
				`('${user.id}', '${user.email}', '${user.password}', '${user.role}')`,
		)
		.join(',\n')

	const query = `
    INSERT INTO users (id, email, password, role)
    VALUES ${values}
    ON DUPLICATE KEY UPDATE
      email = VALUES(email),
      password = VALUES(password),
      role = VALUES(role)
  `

	await prisma.$executeRawUnsafe(query)
}
