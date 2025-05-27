import { RegisterInstructorUseCase } from '@/api/domain/e-learning/application/use-cases/instructor/register-instructor'
import { UserAlreadyExistsError } from '@/api/domain/e-learning/application/use-cases/errors/user-already-exists-error'
import { Instructor } from '@/api/domain/e-learning/enterprise/entities/instructor'
import { InstructorsRepository } from '@/api/domain/e-learning/application/repositories/instructors-repository'
import { jest } from '@jest/globals'
import { HashGenerator } from '@/api/domain/e-learning/cryptography/hash-generator'

describe('RegisterInstructorUseCase', () => {
	let mockRepository: jest.Mocked<InstructorsRepository>
	let mockHashGenerator: jest.Mocked<HashGenerator>
	let useCase: RegisterInstructorUseCase

	beforeEach(() => {
		mockRepository = {
			findByEmail: jest.fn(),
			create: jest.fn(),
			findUnique: jest.fn(),
			remove: jest.fn(),
		} as unknown as jest.Mocked<InstructorsRepository>

		mockHashGenerator = {
			hash: jest.fn(async (password: string) => 'hashed-' + password),
		} as jest.Mocked<HashGenerator>

		useCase = new RegisterInstructorUseCase(mockRepository, mockHashGenerator)
	})

	it('should return UserAlreadyExistsError if instructor with same email already exists', async () => {
		mockRepository.findByEmail.mockResolvedValue(
			Instructor.create({
				name: 'Existing',
				email: 'test@example.com',
				cpf: '12345678901',
				passwordHash: 'hashed-password',
			}),
		)

		const result = await useCase.execute({
			name: 'John Doe',
			email: 'test@example.com',
			cpf: '12345678901',
			passwordHash: 'password123',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
	})

	it('should hash the password and create the instructor', async () => {
		mockRepository.findByEmail.mockResolvedValue(null)
		mockHashGenerator.hash.mockResolvedValue('secure-hashed-password')

		const result = await useCase.execute({
			name: 'Jane Doe',
			email: 'jane@example.com',
			cpf: '98765432100',
			passwordHash: 'plain-password',
			bio: 'Instructor bio',
			phoneNumber: '11999999999',
		})

		expect(mockHashGenerator.hash).toHaveBeenCalledWith('plain-password')
		expect(mockRepository.create).toHaveBeenCalled()
		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value).toHaveProperty('instructor')
			expect(result.value.instructor.email).toBe('jane@example.com')
		}
	})
})
