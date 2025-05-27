import { jest } from '@jest/globals'
import { GetInstructorUseCase } from '@/api/domain/e-learning/application/use-cases/instructor/get-instructor'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Instructor } from '@/api/domain/e-learning/enterprise/entities/instructor'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { InstructorsRepository } from '@/api/domain/e-learning/application/repositories/instructors-repository'

describe('GetInstructorUseCase', () => {
	let mockRepository: jest.Mocked<InstructorsRepository>
	let useCase: GetInstructorUseCase

	beforeEach(() => {
		mockRepository = {
			findUnique: jest.fn(),
		} as unknown as jest.Mocked<InstructorsRepository>
		useCase = new GetInstructorUseCase(mockRepository)
	})

	it('should return ResourceNotFoundError if instructor is not found', async () => {
		mockRepository.findUnique.mockResolvedValue(null)

		const result = await useCase.execute({ email: 'notfound@example.com' })

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should return the instructor if found', async () => {
		const fakeInstructor = Instructor.create(
			{
				name: 'Test Instructor',
				email: 'found@example.com',
				cpf: '12345678901',
				phoneNumber: '11999999999',
				bio: 'Bio',
				passwordHash: 'hashed-password',
				createdAt: new Date(),
				updatedAt: new Date(),
				courses: [],
			},
			new UniqueEntityId('instructor-1'),
		)

		mockRepository.findUnique.mockResolvedValue(fakeInstructor)

		const result = await useCase.execute({ email: 'found@example.com' })

		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({ instructor: fakeInstructor })
	})
})
