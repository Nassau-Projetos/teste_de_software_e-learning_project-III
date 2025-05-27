import { PrismaClient } from '@prisma/client'
import courseStatusData from '../seeds/data/courseStatus.json'

export async function seedCourseStatus(prisma: PrismaClient) {
	const values = courseStatusData
		.map((status) => `(${status.id}, '${status.name}')`) // removido a vírgula dentro
		.join(', ')

	const query = `
    INSERT INTO courseStatus (id, name)
    VALUES ${values}
    ON DUPLICATE KEY UPDATE name = VALUES(name)
  `

	await prisma.$executeRawUnsafe(query)
}
