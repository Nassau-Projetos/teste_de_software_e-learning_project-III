import { GetStudentUseCase } from '@/api/domain/e-learning/application/use-cases/student/get-student'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Student } from '@/api/domain/e-learning/enterprise/entities/student'
import { StudentsRepository } from '@/api/domain/e-learning/application/repositories/students-repository'

import { jest } from '@jest/globals'

describe('GetStudentUseCase', () => {
	let mockRepository: jest.Mocked<StudentsRepository>
	let useCase: GetStudentUseCase

	beforeEach(() => {
		mockRepository = {
			findUnique: jest.fn(),
		} as unknown as jest.Mocked<StudentsRepository>

		useCase = new GetStudentUseCase(mockRepository)
	})

	it('should return ResourceNotFoundError if no student is found', async () => {
		mockRepository.findUnique.mockResolvedValue(null)

		const result = await useCase.execute({ email: 'notfound@example.com' })

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should return student if found by email', async () => {
		const fakeStudent = Student.create({
			name: 'John Doe',
			email: 'john@example.com',
			cpf: '12345678901',
			passwordHash: 'somehash',
		})

		mockRepository.findUnique.mockResolvedValue(fakeStudent)

		const result = await useCase.execute({ email: 'john@example.com' })

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.student.email).toBe('john@example.com')
			expect(result.value.student.name).toBe('John Doe')
		}
	})
})
