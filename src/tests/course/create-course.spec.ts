import { CreateCourseUseCase } from '../../api/domain/e-learning/application/use-cases/course/create-course'
import { CoursesRepository } from '../../api/domain/e-learning/application/repositories/courses-repository'
import { InstructorsRepository } from '../../api/domain/e-learning/application/repositories/instructors-repository'
import { CourseCategorysRepository } from '../../api/domain/e-learning/application/repositories/course-catogories-repository'
import { Course } from '../../api/domain/e-learning/enterprise/entities/course'
import { CourseCategory } from '../../api/domain/e-learning/enterprise/entities/course-category'
import { Instructor } from '../../api/domain/e-learning/enterprise/entities/instructor'
import { jest } from '@jest/globals'

describe('CreateCourseUseCase', () => {
	let coursesRepository: CoursesRepository
	let categoriesRepository: CourseCategorysRepository
	let instructorsRepository: InstructorsRepository
	let useCase: CreateCourseUseCase

	beforeEach(() => {
		coursesRepository = {
			create: jest.fn(async (_data: Course) => {}),
			findUnique: jest.fn(async (_query) => null),
			save: jest.fn(async (_course: Course) => {}),
			remove: jest.fn(async (_course: Course) => {}),
			findManyByCategoryId: jest.fn(async (_query: any) => []),
		}

		categoriesRepository = {
			findUnique: jest.fn(async (_query) =>
				CourseCategory.create({
					icon: 'icon.png',
					courseCount: 0,
					createdAt: new Date(),
				}),
			),
			create: jest.fn(async (data: CourseCategory) => Promise.resolve(data)),
			delete: jest.fn(async (_categoryId: number) => {}),
			findByName: jest.fn(async (_params: { name: string }) => null),
			save: jest.fn(async (_category: CourseCategory) => {}),
		}

		instructorsRepository = {
			findUnique: jest.fn(async (_query) =>
				Instructor.create({
					name: 'Instrutor Teste',
					email: 'instrutor.teste@example.com',
					cpf: '12345678901',
					phoneNumber: '11999999999',
					bio: 'Bio do instrutor',
					createdAt: new Date(),
					updatedAt: new Date(),
					courses: [],
					passwordHash: 'hashed-password',
				}),
			),
			findByEmail: jest.fn(async (_query: { email: string }) => null),
			create: jest.fn(async (_data: Instructor) => {}),
			save: jest.fn(async (_instructor: Instructor) => {}),
			remove: jest.fn(async (_instructor: Instructor) => {}),
		}

		useCase = new CreateCourseUseCase(
			coursesRepository,
			categoriesRepository,
			instructorsRepository,
		)
	})

	it('should create a course successfully', async () => {
		const input = {
			title: 'Curso de Testes',
			description: 'Aprenda testes',
			thumbnailUrl: 'url.jpg',
			duration: 60,
			price: 100,
			instructorId: 'inst-1',
			categoryId: 1,
			level: 'BEGINNER',
		}

		const result = await useCase.execute(input)

		expect(result.isRight()).toBe(true)

		if (result.isRight()) {
			expect(result.value.course).toBeInstanceOf(Course)
			expect(coursesRepository.create).toHaveBeenCalled()
		}
	})

	it('should return error if instructor is not found', async () => {
		instructorsRepository.findUnique = jest.fn(
			async (_query: any): Promise<Instructor | null> => null,
		)

		const result = await useCase.execute({
			title: 'Curso',
			description: '',
			thumbnailUrl: 'thumb.jpg',
			duration: 30,
			price: 50,
			instructorId: 'invalid-id',
			categoryId: 1,
			level: 'beginner',
		})

		expect(result.isLeft()).toBe(true)
		expect(instructorsRepository.findUnique).toHaveBeenCalled()
	})

	it('should return error if category is not found', async () => {
		categoriesRepository.findUnique = jest.fn(async (_query: any) => null) as (
			query: any,
		) => Promise<CourseCategory | null>

		const result = await useCase.execute({
			title: 'Curso sem categoria',
			description: 'Teste',
			thumbnailUrl: 'img.jpg',
			duration: 20,
			price: 40,
			instructorId: 'inst-1',
			categoryId: 999,
			level: 'beginner',
		})

		expect(result.isLeft()).toBe(true)
		expect(categoriesRepository.findUnique).toHaveBeenCalled()
	})
})
