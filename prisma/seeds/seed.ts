import { PrismaClient } from '@prisma/client'
import { seedCourseCategory } from './courseCategory-seedRaw'

const prisma = new PrismaClient()

async function main() {
	await Promise.all([seedCourseCategory(prisma)])
}

main().catch(async (err) => {
	console.log(err)
	process.exit(1)
})
