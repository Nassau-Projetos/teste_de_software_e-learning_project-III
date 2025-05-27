import { makeInstructor } from '@/tests/factories/make-instructor'
import { InMemoryInstructorsRepository } from '@/tests/repositories/in-memory-instructor-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WrongCrenditialsError } from '../../errors/wrong-credentials-error'
import { AuthenticateInstructorUseCase } from './authenticate-instructor'

describe('Authenticate Instructor', () => {
	let instructorsRepository: InMemoryInstructorsRepository
	let hashComparer: { compare: ReturnType<typeof vi.fn> }
	let encrypter: { encrypt: ReturnType<typeof vi.fn> }
	let sut: AuthenticateInstructorUseCase

	beforeEach(() => {
		instructorsRepository = new InMemoryInstructorsRepository()
		hashComparer = { compare: vi.fn() }
		encrypter = { encrypt: vi.fn() }
		sut = new AuthenticateInstructorUseCase(
			instructorsRepository,
			hashComparer,
			encrypter,
		)
	})

	it('should authenticate instructor with correct credentials', async () => {
		const password = 'valid_password'
		const instructor = makeInstructor({ passwordHash: 'hashed_password' })
		instructorsRepository.create(instructor)

		hashComparer.compare.mockResolvedValue(true)
		encrypter.encrypt.mockResolvedValue('valid_token')

		const result = await sut.execute({ email: instructor.email, password })

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.accessToken).toBe('valid_token')
			expect(result.value.instructor).toEqual(instructor)
		}
		expect(hashComparer.compare).toHaveBeenCalledWith(
			password,
			instructor.passwordHash,
		)
		expect(encrypter.encrypt).toHaveBeenCalledWith({
			sub: instructor.id.toString(),
		})
	})

	it('should return WrongCrenditialsError if instructor does not exist', async () => {
		hashComparer.compare.mockResolvedValue(false)

		const result = await sut.execute({
			email: 'nonexistent@example.com',
			password: 'any',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(WrongCrenditialsError)
	})

	it('should return WrongCrenditialsError if password is incorrect', async () => {
		const instructor = makeInstructor({ passwordHash: 'hashed_password' })
		instructorsRepository.create(instructor)

		hashComparer.compare.mockResolvedValue(false)

		const result = await sut.execute({
			email: instructor.email,
			password: 'wrong_password',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(WrongCrenditialsError)
	})
})
