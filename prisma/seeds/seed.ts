import { PrismaClient } from '@prisma/client'
import { seedCourse } from './course-seedRaw'
import { seedCourseCategory } from './courseCategory-seedRaw'
import { seedCourseStatus } from './courseStatus-seedRaw'
import { seedInstructor } from './instructor-seedRaw'
import { seedStudent } from './student-seedRaw'
import { seedUser } from './user-seedRaw'

const prisma = new PrismaClient()

async function main() {
	await Promise.all([
		seedCourseCategory(prisma),
		seedCourseStatus(prisma),
		seedUser(prisma),
	])

	await Promise.all([seedStudent(prisma), seedInstructor(prisma)])

	await seedCourse(prisma)
}

main().catch(async (err) => {
	console.log(err)
	process.exit(1)
})
