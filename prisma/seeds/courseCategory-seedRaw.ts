import { PrismaClient } from '@prisma/client'
import courseCategoryData from '../seeds/data/courseCategory.json'

export async function seedCourseCategory(prisma: PrismaClient) {
	const values = courseCategoryData
		.map((category) => {
			return `(
        ${category.id}, 
        '${category.name}', 
        '${category.icon}'
      )`
		})
		.join(', ')
	const query = `
    INSERT INTO 
    CourseCategory (id, name, icon)
    VALUES ${values}
  `
	await prisma.$executeRawUnsafe(query)
}
