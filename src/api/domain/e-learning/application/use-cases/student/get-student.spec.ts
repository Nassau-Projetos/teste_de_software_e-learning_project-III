import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { makeStudent } from '@/tests/factories/make-student'
import { InMemoryStudentsRepository } from '@/tests/repositories/in-memory-students-repository'
import { GetStudentUseCase } from './get-student'

describe('Get Student', () => {
	let studentsRepository: InMemoryStudentsRepository
	let sut: GetStudentUseCase

	beforeEach(() => {
		studentsRepository = new InMemoryStudentsRepository()
		sut = new GetStudentUseCase(studentsRepository)
	})

	it('should return student if found', async () => {
		const student = makeStudent()
		studentsRepository.create(student)

		const result = await sut.execute({ studentId: student.id.toString() })

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.student).toEqual(student)
		}
	})

	it('should return ResourceNotFoundError if student does not exist', async () => {
		const result = await sut.execute({ studentId: 'non-existent-id' })

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
