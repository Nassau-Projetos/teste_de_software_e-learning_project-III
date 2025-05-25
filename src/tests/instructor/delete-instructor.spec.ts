import { DeleteInstructorUseCase } from '@/api/domain/e-learning/application/use-cases/instructor/delete-instructor'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Instructor } from '@/api/domain/e-learning/enterprise/entities/instructor'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { jest } from '@jest/globals'
import { InstructorsRepository } from '@/api/domain/e-learning/application/repositories/instructors-repository'

describe('DeleteInstructorUseCase', () => {
	let mockRepository: jest.Mocked<InstructorsRepository>
	let useCase: DeleteInstructorUseCase

	beforeEach(() => {
		mockRepository = {
			findUnique: jest.fn(),
			remove: jest.fn(),
		} as unknown as jest.Mocked<InstructorsRepository>
		useCase = new DeleteInstructorUseCase(mockRepository)
	})

	it('should return ResourceNotFoundError if instructor is not found', async () => {
		mockRepository.findUnique.mockResolvedValue(null)

		const result = await useCase.execute({ instructorId: 'non-existent-id' })

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should delete the instructor if found', async () => {
		const fakeInstructor = Instructor.create(
			{
				name: 'Instructor Test',
				email: 'test@example.com',
				cpf: '12345678901',
				phoneNumber: '11999999999',
				bio: 'Test bio',
				passwordHash: 'hashed-password',
				createdAt: new Date(),
				updatedAt: new Date(),
				courses: [],
			},
			new UniqueEntityId('instructor-1'),
		)

		mockRepository.findUnique.mockResolvedValue(fakeInstructor)
		mockRepository.remove.mockResolvedValue(undefined)

		const result = await useCase.execute({ instructorId: 'instructor-1' })

		expect(mockRepository.remove).toHaveBeenCalledWith(fakeInstructor)
		expect(result.isRight()).toBe(true)
		expect(result.value).toBeNull()
	})
})
