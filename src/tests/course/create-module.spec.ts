import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { CourseModulesRepository } from '@/api/domain/e-learning/application/repositories/course-modules-repository'
import { CoursesRepository } from '@/api/domain/e-learning/application/repositories/courses-repository'
import { CreateCourseModuleUseCase } from '@/api/domain/e-learning/application/use-cases/course/create-module'
import { Course } from '@/api/domain/e-learning/enterprise/entities/course'
import { CourseCategory } from '@/api/domain/e-learning/enterprise/entities/course-category'
import { Instructor } from '@/api/domain/e-learning/enterprise/entities/instructor'
import { CourseLevel } from '@/api/domain/e-learning/enterprise/entities/value-objects/course/level'
import { Price } from '@/api/domain/e-learning/enterprise/entities/value-objects/price/price'
import { jest } from '@jest/globals'
describe('CreateCourseModuleUseCase', () => {
	let coursesRepository: CoursesRepository
	let modulesRepository: CourseModulesRepository
	let useCase: CreateCourseModuleUseCase

	const courseId = 'course-123'
	const courseUid = new UniqueEntityId(courseId)

	let course: Course

	beforeEach(() => {
		const category = CourseCategory.create({
			icon: 'icon.png',
			courseCount: 0,
			createdAt: new Date(),
		})

		const instructor = Instructor.create({
			name: 'Instrutor Teste',
			email: 'test@example.com',
			cpf: '12345678901',
			phoneNumber: '11999999999',
			bio: 'Bio',
			createdAt: new Date(),
			updatedAt: new Date(),
			courses: [],
			passwordHash: 'hash',
		})

		course = Course.create(
			{
				title: 'Curso Teste',
				description: 'Descrição do curso',
				thumbnailUrl: 'thumb.jpg',
				duration: 100,
				price: Price.create(150),
				level: CourseLevel.BEGINNER,
				instructorId: instructor.id,
				category,
				modules: [],
			},
			courseUid,
		)

		coursesRepository = {
			create: jest.fn(async (_data: Course) => {}),
			findUnique: jest.fn(async (_query) => course),
			save: jest.fn(async (_course: Course) => {}),
			remove: jest.fn(async (_course: Course) => {}),
			findManyByCategoryId: jest.fn(async (_query: any) => []),
		}

		modulesRepository = {
			create: jest.fn(async (_module) => {}) as (module: any) => Promise<void>,
			save: jest.fn(async (_module) => {}),
			findById: jest.fn(async (_id) => null),
			findByCourseId: jest.fn(async (_courseId) => []),
			delete: jest.fn(async (_module) => {}),
		}

		useCase = new CreateCourseModuleUseCase(
			modulesRepository,
			coursesRepository,
		)
	})

	it('should create a new module with default order', async () => {
		const response = await useCase.execute({
			courseId,
			data: {
				title: 'Módulo 1',
			},
		})

		expect(response.isRight()).toBe(true)

		if (response.isRight()) {
			const { module } = response.value
			expect(module.title).toBe('Módulo 1')
			expect(module.order).toBe(0)
			expect(modulesRepository.create).toHaveBeenCalledWith(module)
			expect(modulesRepository.create).toHaveBeenCalledTimes(1)
			expect(coursesRepository.save).toHaveBeenCalledWith(course)
			expect(coursesRepository.save).toHaveBeenCalledTimes(1)
		}
	})

	it('should create a module with custom order', async () => {
		const response = await useCase.execute({
			courseId,
			data: {
				title: 'Módulo 2',
				order: 5,
			},
		})

		expect(response.isRight()).toBe(true)

		if (response.isRight()) {
			const { module } = response.value
			expect(module.order).toBe(5)
		}
	})

	it('should return ResourceNotFoundError if course does not exist', async () => {
		coursesRepository.findUnique = jest.fn(async (_query) => null)

		const result = await useCase.execute({
			courseId: 'invalid-id',
			data: {
				title: 'Módulo',
			},
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
