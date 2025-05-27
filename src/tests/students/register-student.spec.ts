import { RegisterStudentUseCase } from '@/api/domain/e-learning/application/use-cases/student/register-student'
import { UserAlreadyExistsError } from '@/api/domain/e-learning/application/use-cases/errors/user-already-exists-error'
import { Student } from '@/api/domain/e-learning/enterprise/entities/student'
import { StudentsRepository } from '@/api/domain/e-learning/application/repositories/students-repository'
import { HashGenerator } from '@/api/domain/e-learning/cryptography/hash-generator'
import { jest } from '@jest/globals'

describe('RegisterStudentUseCase', () => {
	let mockRepository: jest.Mocked<StudentsRepository>
	let mockHashGenerator: jest.Mocked<HashGenerator>
	let useCase: RegisterStudentUseCase

	beforeEach(() => {
		mockRepository = {
			findByEmail: jest.fn(),
			create: jest.fn(),
		} as unknown as jest.Mocked<StudentsRepository>

		mockHashGenerator = {
			hash: jest.fn(async (password: string) => 'hashed-' + password),
		} as jest.Mocked<HashGenerator>

		useCase = new RegisterStudentUseCase(mockRepository, mockHashGenerator)
	})

	it('should return UserAlreadyExistsError if student with same email already exists', async () => {
		mockRepository.findByEmail.mockResolvedValue(
			Student.create({
				name: 'Existing Student',
				email: 'test@example.com',
				cpf: '12345678901',
				passwordHash: 'hashed-password',
			}),
		)

		const result = await useCase.execute({
			name: 'New Student',
			email: 'test@example.com',
			cpf: '98765432100',
			password: 'password123',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
	})

	it('should hash the password and create the student', async () => {
		mockRepository.findByEmail.mockResolvedValue(null)
		mockHashGenerator.hash.mockResolvedValue('secure-hashed-password')
		mockRepository.create.mockResolvedValue(undefined)

		const result = await useCase.execute({
			name: 'New Student',
			email: 'new@example.com',
			cpf: '98765432100',
			password: 'plain-password',
			phoneNumber: '11999999999',
		})

		expect(mockHashGenerator.hash).toHaveBeenCalledWith('plain-password')
		expect(mockRepository.create).toHaveBeenCalled()
		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.student.email).toBe('new@example.com')
			expect(result.value.student.passwordHash).toBe('secure-hashed-password')
		}
	})
})
