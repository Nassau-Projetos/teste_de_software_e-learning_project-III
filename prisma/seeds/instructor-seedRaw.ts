import { PrismaClient } from '@prisma/client'
import instructorData from '../seeds/data/instructor.json'

export async function seedInstructor(prisma: PrismaClient) {
	const values = instructorData
		.map((instructor) => {
			const id = instructor.id
			const name = instructor.name.replace(/'/g, "''")
			const cpf = instructor.cpf
			const phoneNumber = instructor.phoneNumber
				? `'${instructor.phoneNumber}'`
				: 'NULL'
			const userId = instructor.userId
			const bio = instructor.bio
				? `'${instructor.bio.replace(/'/g, "''")}'`
				: 'NULL'

			return `('${id}', '${name}', '${cpf}', ${phoneNumber}, '${userId}', ${bio})`
		})
		.join(',\n')

	const query = `
    INSERT INTO instructors (id, name, cpf, phoneNumber, userId, bio)
    VALUES ${values}
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      cpf = VALUES(cpf),
      phoneNumber = VALUES(phoneNumber),
      bio = VALUES(bio)
  `

	await prisma.$executeRawUnsafe(query)
}
