import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { makeInstructor } from '@/tests/factories/make-instructor'
import { InMemoryInstructorsRepository } from '@/tests/repositories/in-memory-instructor-repository'
import { DeleteInstructorUseCase } from './delete-instructor'

describe('Delete Instructor', () => {
	let instructorsRepository: InMemoryInstructorsRepository
	let sut: DeleteInstructorUseCase

	beforeEach(() => {
		instructorsRepository = new InMemoryInstructorsRepository()
		sut = new DeleteInstructorUseCase(instructorsRepository)
	})

	it('should delete instructor if found', async () => {
		const instructor = makeInstructor()
		instructorsRepository.create(instructor)

		const result = await sut.execute({ instructorId: instructor.id.toString() })

		expect(result.isRight()).toBe(true)
		expect(instructorsRepository.items).toHaveLength(0)
	})

	it('should return ResourceNotFoundError if instructor does not exist', async () => {
		const result = await sut.execute({ instructorId: 'non-existent-id' })

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
