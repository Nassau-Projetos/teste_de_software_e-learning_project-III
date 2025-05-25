import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Instructor } from '@/api/domain/e-learning/enterprise/entities/instructor'
import { InstructorsRepository } from '@/api/domain/e-learning/application/repositories/instructors-repository'
import { jest } from '@jest/globals'
import { UpdateInstructorUseCase } from '@/api/domain/e-learning/application/use-cases/instructor/update-instructor-details'
import { HashGenerator } from '@/api/domain/e-learning/cryptography/hash-generator'

const makeFakeInstructor = () =>
	Instructor.create({
		name: 'Old Name',
		email: 'old@example.com',
		cpf: '12345678901',
		passwordHash: 'old-hash',
		bio: 'Old bio',
		phoneNumber: '123456789',
	})

describe('UpdateInstructorUseCase', () => {
	let useCase: UpdateInstructorUseCase
	let mockRepository: jest.Mocked<InstructorsRepository>
	let mockHashGenerator: jest.Mocked<HashGenerator>

	beforeEach(() => {
		mockRepository = {
			findUnique: jest.fn(),
			save: jest.fn(),
		} as unknown as jest.Mocked<InstructorsRepository>

		mockHashGenerator = {
			hash: jest.fn(async (password: string) => 'hashed-' + password),
		} as jest.Mocked<HashGenerator>

		useCase = new UpdateInstructorUseCase(mockRepository)
	})

	it('should return ResourceNotFoundError if instructor does not exist', async () => {
		mockRepository.findUnique.mockResolvedValue(null)

		const result = await useCase.execute({
			instructorId: 'nonexistent-id',
			data: { name: 'New Name' },
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should update the instructor with new data', async () => {
		const fakeInstructor = makeFakeInstructor()
		mockRepository.findUnique.mockResolvedValue(fakeInstructor)

		const result = await useCase.execute({
			instructorId: 'existing-id',
			data: {
				name: 'Updated Name',
				email: 'updated@example.com',
				bio: 'Updated bio',
				phoneNumber: '987654321',
			},
		})

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.instructor.name).toBe('Updated Name')
			expect(result.value.instructor.email).toBe('updated@example.com')
			expect(result.value.instructor.bio).toBe('Updated bio')
			expect(result.value.instructor.phoneNumber).toBe('987654321')
			expect(mockRepository.save).toHaveBeenCalledWith(result.value.instructor)
		}
	})

	it('should update the instructor password if password is provided', async () => {
		const fakeInstructor = makeFakeInstructor()
		mockRepository.findUnique.mockResolvedValue(fakeInstructor)

		const hashedPassword = 'already-hashed-password'

		const result = await useCase.execute({
			instructorId: 'existing-id',
			data: {
				password: hashedPassword, // senha já hasheada
			},
		})

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.instructor.passwordHash).toBe(hashedPassword)
		}
	})
})
