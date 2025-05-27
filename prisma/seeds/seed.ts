import { PrismaClient } from '@prisma/client'
import { seedCourseCategory } from './courseCategory-seedRaw'
import { seedCourseStatus } from './courseStatus-seedRaw'

const prisma = new PrismaClient()

async function main() {
	await Promise.all([seedCourseCategory(prisma), seedCourseStatus(prisma)])
}

main().catch(async (err) => {
	console.log(err)
	process.exit(1)
})
