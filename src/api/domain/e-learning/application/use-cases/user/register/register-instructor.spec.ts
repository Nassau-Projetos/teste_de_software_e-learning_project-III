import { Instructor } from '@/api/domain/e-learning/enterprise/entities/instructor'
import { InMemoryInstructorsRepository } from '@/tests/repositories/in-memory-instructor-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UserAlreadyExistsError } from '../../errors/user-already-exists-error'
import { RegisterInstructorUseCase } from './register-instructor'

describe('RegisterInstructorUseCase', () => {
	let instructorRepository: InMemoryInstructorsRepository
	let hashGenerator: { hash: ReturnType<typeof vi.fn> }
	let sut: RegisterInstructorUseCase

	beforeEach(() => {
		instructorRepository = new InMemoryInstructorsRepository()
		hashGenerator = { hash: vi.fn() }
		sut = new RegisterInstructorUseCase(instructorRepository, hashGenerator)
	})

	it('should register a new instructor successfully', async () => {
		hashGenerator.hash.mockResolvedValue('hashed_password')

		const request = {
			name: 'John Doe',
			bio: 'Expert in programming',
			cpf: '123.456.789-00',
			phoneNumber: '99999-9999',
			email: 'john@example.com',
			passwordHash: 'plain_password',
		}

		const result = await sut.execute(request)

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.instructor).toBeInstanceOf(Instructor)
			expect(result.value.instructor.email).toBe(request.email)
			expect(result.value.instructor.passwordHash).toBe('hashed_password')
		}

		const savedInstructor = instructorRepository.items.find(
			(i) => i.email === request.email,
		)
		expect(savedInstructor).toBeDefined()
	})

	it('should not register if email already exists', async () => {
		const existingInstructor = Instructor.create({
			name: 'Existing',
			cpf: '000.000.000-00',
			email: 'existing@example.com',
			passwordHash: 'hashed',
		})
		instructorRepository.create(existingInstructor)

		const request = {
			name: 'New Instructor',
			cpf: '111.111.111-11',
			email: 'existing@example.com',
			passwordHash: 'some_password',
		}

		const result = await sut.execute(request)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
	})
})
