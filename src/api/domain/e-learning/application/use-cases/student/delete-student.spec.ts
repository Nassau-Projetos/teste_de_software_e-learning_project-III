import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { makeStudent } from '@/tests/factories/make-student'
import { InMemoryStudentsRepository } from '@/tests/repositories/in-memory-students-repository'
import { DeleteStudentUseCase } from './delete-student'

describe('Delete Student', () => {
	let studentsRepository: InMemoryStudentsRepository
	let sut: DeleteStudentUseCase

	beforeEach(() => {
		studentsRepository = new InMemoryStudentsRepository()
		sut = new DeleteStudentUseCase(studentsRepository)
	})

	it('should delete student if found', async () => {
		const student = makeStudent()
		studentsRepository.create(student)

		const result = await sut.execute({ studentId: student.id.toString() })

		expect(result.isRight()).toBe(true)
		expect(studentsRepository.items).toHaveLength(0)
	})

	it('should return ResourceNotFoundError if student does not exist', async () => {
		const result = await sut.execute({ studentId: 'non-existent-id' })

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
