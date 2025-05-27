import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { makeInstructor } from '@/tests/factories/make-instructor'
import { InMemoryInstructorsRepository } from '@/tests/repositories/in-memory-instructor-repository'
import { GetInstructorUseCase } from './get-instructor'

describe('Get Instructor', () => {
	let instructorsRepository: InMemoryInstructorsRepository
	let sut: GetInstructorUseCase

	beforeEach(() => {
		instructorsRepository = new InMemoryInstructorsRepository()
		sut = new GetInstructorUseCase(instructorsRepository)
	})

	it('should return instructor if found', async () => {
		const instructor = makeInstructor()
		instructorsRepository.create(instructor)

		const result = await sut.execute({ instructorId: instructor.id.toString() })

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.instructor).toEqual(instructor)
		}
	})

	it('should return ResourceNotFoundError if instructor does not exist', async () => {
		const result = await sut.execute({ instructorId: 'non-existent-id' })

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
