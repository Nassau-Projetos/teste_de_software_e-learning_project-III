import { DeleteStudentUseCase } from '@/api/domain/e-learning/application/use-cases/student/delete-student'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { StudentsRepository } from '@/api/domain/e-learning/application/repositories/students-repository'
import { jest } from '@jest/globals'

describe('DeleteStudentUseCase', () => {
	let mockRepository: jest.Mocked<StudentsRepository>
	let useCase: DeleteStudentUseCase

	beforeEach(() => {
		mockRepository = {
			findUnique: jest.fn(),
			remove: jest.fn(),
		} as unknown as jest.Mocked<StudentsRepository>

		useCase = new DeleteStudentUseCase(mockRepository)
	})

	it('should return ResourceNotFoundError if student does not exist', async () => {
		mockRepository.findUnique.mockResolvedValue(null)

		const result = await useCase.execute({ studentId: 'nonexistent-id' })

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
		expect(mockRepository.remove).not.toHaveBeenCalled()
	})

	it('should remove student if found', async () => {
		const fakeStudent = { id: 'student-id', name: 'John Doe' } as any
		mockRepository.findUnique.mockResolvedValue(fakeStudent)
		mockRepository.remove.mockResolvedValue(undefined)

		const result = await useCase.execute({ studentId: 'student-id' })

		expect(result.isRight()).toBe(true)
		expect(mockRepository.remove).toHaveBeenCalledWith(fakeStudent)
	})
})
