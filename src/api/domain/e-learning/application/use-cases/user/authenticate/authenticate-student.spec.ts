import { makeStudent } from '@/tests/factories/make-student'
import { InMemoryStudentsRepository } from '@/tests/repositories/in-memory-students-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WrongCrenditialsError } from '../../errors/wrong-credentials-error'
import { AuthenticateStudentUseCase } from './authenticate-student'

describe('AuthenticateStudentUseCase', () => {
	let studentsRepository: InMemoryStudentsRepository
	let hashComparer: { compare: ReturnType<typeof vi.fn> }
	let encrypter: { encrypt: ReturnType<typeof vi.fn> }
	let sut: AuthenticateStudentUseCase

	beforeEach(() => {
		studentsRepository = new InMemoryStudentsRepository()
		hashComparer = { compare: vi.fn() }
		encrypter = { encrypt: vi.fn() }
		sut = new AuthenticateStudentUseCase(
			studentsRepository,
			hashComparer,
			encrypter,
		)
	})

	it('should authenticate student with correct credentials', async () => {
		const password = 'valid_password'
		const student = makeStudent({ passwordHash: 'hashed_password' })
		studentsRepository.create(student)

		hashComparer.compare.mockResolvedValue(true)
		encrypter.encrypt.mockResolvedValue('valid_token')

		const result = await sut.execute({ email: student.email, password })

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.accessToken).toBe('valid_token')
			expect(result.value.student).toEqual(student)
		}
		expect(hashComparer.compare).toHaveBeenCalledWith(
			password,
			student.passwordHash,
		)
		expect(encrypter.encrypt).toHaveBeenCalledWith({
			sub: student.id.toString(),
		})
	})

	it('should return WrongCrenditialsError if student does not exist', async () => {
		hashComparer.compare.mockResolvedValue(false)

		const result = await sut.execute({
			email: 'nonexistent@example.com',
			password: 'any',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(WrongCrenditialsError)
	})

	it('should return WrongCrenditialsError if password is incorrect', async () => {
		const student = makeStudent({ passwordHash: 'hashed_password' })
		studentsRepository.create(student)

		hashComparer.compare.mockResolvedValue(false)

		const result = await sut.execute({
			email: student.email,
			password: 'wrong_password',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(WrongCrenditialsError)
	})
})
