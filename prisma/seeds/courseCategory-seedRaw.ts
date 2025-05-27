import { PrismaClient } from '@prisma/client'
import courseCategoryData from '../seeds/data/courseCategory.json'

export async function seedCourseCategory(prisma: PrismaClient) {
	const values = courseCategoryData
		.map(
			(category) => `(${category.id}, '${category.name}', '${category.icon}')`,
		)
		.join(', ')

	const query = `
    INSERT INTO courseCategories (id, name, icon)
    VALUES ${values}
    ON DUPLICATE KEY UPDATE name = VALUES(name), icon = VALUES(icon)
  `

	await prisma.$executeRawUnsafe(query)
}
