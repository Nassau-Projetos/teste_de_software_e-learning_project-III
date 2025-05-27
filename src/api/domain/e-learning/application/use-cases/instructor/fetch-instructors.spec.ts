import { makeInstructor } from '@/tests/factories/make-instructor'
import { InMemoryInstructorsRepository } from '@/tests/repositories/in-memory-instructor-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchInstructorsUseCase } from './fetch-instructors'

let inMemoryInstructorsRepository: InMemoryInstructorsRepository
let sut: FetchInstructorsUseCase

describe('Fetch instructors', () => {
	beforeEach(() => {
		inMemoryInstructorsRepository = new InMemoryInstructorsRepository()
		sut = new FetchInstructorsUseCase(inMemoryInstructorsRepository)
	})

	it('should return a list of instructors on success', async () => {
		const instructor1 = makeInstructor()
		const instructor2 = makeInstructor()

		await inMemoryInstructorsRepository.create(instructor1)
		await inMemoryInstructorsRepository.create(instructor2)

		const result = await sut.execute({ page: 1, limit: 10 })

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.instructors).toHaveLength(2)
		}
	})

	it('should return empty array if no instructors found', async () => {
		const result = await sut.execute({ page: 1, limit: 10 })

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.instructors).toHaveLength(0)
		}
	})
})
