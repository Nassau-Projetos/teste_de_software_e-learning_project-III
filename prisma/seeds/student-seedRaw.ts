import { PrismaClient } from '@prisma/client'
import studentData from '../seeds/data/student.json'

export async function seedStudent(prisma: PrismaClient) {
	const values = studentData
		.map(
			(student) =>
				`('${student.id}', '${student.name}', '${student.cpf}', ${student.phoneNumber ? `'${student.phoneNumber}'` : null}, '${student.userId}')`,
		)
		.join(',\n')

	const query = `
    INSERT INTO students (id, name, cpf, phoneNumber, userId)
    VALUES ${values}
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      cpf = VALUES(cpf),
      phoneNumber = VALUES(phoneNumber)
  `

	await prisma.$executeRawUnsafe(query)
}
