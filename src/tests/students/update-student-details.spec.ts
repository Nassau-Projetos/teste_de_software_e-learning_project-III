import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Student } from '@/api/domain/e-learning/enterprise/entities/student'
import { StudentsRepository } from '@/api/domain/e-learning/application/repositories/students-repository'
import { jest } from '@jest/globals'
import { UpdateStudentUseCase } from '@/api/domain/e-learning/application/use-cases/student/update-student-details'
import { HashGenerator } from '@/api/domain/e-learning/cryptography/hash-generator'

const makeFakeStudent = () =>
	Student.create({
		name: 'Old Name',
		email: 'old@example.com',
		cpf: '12345678901',
		passwordHash: 'old-hash',
		phoneNumber: '123456789',
	})

describe('UpdateStudentUseCase', () => {
	let useCase: UpdateStudentUseCase
	let mockRepository: jest.Mocked<StudentsRepository>
	let mockHashGenerator: jest.Mocked<HashGenerator>

	beforeEach(() => {
		mockRepository = {
			findUnique: jest.fn(),
			save: jest.fn(),
		} as unknown as jest.Mocked<StudentsRepository>

		mockHashGenerator = {
			hash: jest.fn(async (password: string) => 'hashed-' + password),
		} as jest.Mocked<HashGenerator>

		useCase = new UpdateStudentUseCase(mockRepository)
	})

	it('should return ResourceNotFoundError if student does not exist', async () => {
		mockRepository.findUnique.mockResolvedValue(null)

		const result = await useCase.execute({
			studentId: 'nonexistent-id',
			data: { name: 'New Name' },
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should update the student with new data except password', async () => {
		const fakeStudent = makeFakeStudent()
		mockRepository.findUnique.mockResolvedValue(fakeStudent)

		const result = await useCase.execute({
			studentId: 'existing-id',
			data: {
				name: 'Updated Name',
				email: 'updated@example.com',
				phoneNumber: '987654321',
			},
		})

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.student.name).toBe('Updated Name')
			expect(result.value.student.email).toBe('updated@example.com')
			expect(result.value.student.phoneNumber).toBe('987654321')
			expect(result.value.student.passwordHash).toBe('old-hash') // senha não alterada
			expect(mockRepository.save).toHaveBeenCalledWith(result.value.student)
		}
	})

	it('should update password directly without hashing', async () => {
		const fakeStudent = makeFakeStudent()
		mockRepository.findUnique.mockResolvedValue(fakeStudent)

		const result = await useCase.execute({
			studentId: 'existing-id',
			data: {
				password: 'newpassword123',
			},
		})

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.student.passwordHash).toBe('newpassword123')
		}
	})
})
