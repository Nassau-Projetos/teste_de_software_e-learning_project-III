import { Student } from '@/api/domain/e-learning/enterprise/entities/student'
import { InMemoryStudentsRepository } from '@/tests/repositories/in-memory-students-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UserAlreadyExistsError } from '../../errors/user-already-exists-error'
import { RegisterStudentUseCase } from './register-student'

describe('RegisterStudentUseCase', () => {
	let studentRepository: InMemoryStudentsRepository
	let hashGenerator: { hash: ReturnType<typeof vi.fn> }
	let sut: RegisterStudentUseCase

	beforeEach(() => {
		studentRepository = new InMemoryStudentsRepository()
		hashGenerator = { hash: vi.fn() }
		sut = new RegisterStudentUseCase(studentRepository, hashGenerator)
	})

	it('should register a new student successfully', async () => {
		hashGenerator.hash.mockResolvedValue('hashed_password')

		const request = {
			name: 'John Doe',
			cpf: '123.456.789-00',
			phoneNumber: '99999-9999',
			email: 'john@example.com',
			password: 'plain_password',
		}

		const result = await sut.execute(request)

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.student).toBeInstanceOf(Student)
			expect(result.value.student.email).toBe(request.email)
			expect(result.value.student.passwordHash).toBe('hashed_password')
		}

		const savedStudent = studentRepository.items.find(
			(i) => i.email === request.email,
		)
		expect(savedStudent).toBeDefined()
	})

	it('should not register if email already exists', async () => {
		const existingStudent = Student.create({
			name: 'Existing',
			cpf: '000.000.000-00',
			email: 'existing@example.com',
			passwordHash: 'hashed',
		})
		studentRepository.create(existingStudent)

		const request = {
			name: 'New Student',
			cpf: '111.111.111-11',
			email: 'existing@example.com',
			password: 'some_password',
		}

		const result = await sut.execute(request)

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
	})
})
