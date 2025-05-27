import { DeleteCourseUseCase } from '../../api/domain/e-learning/application/use-cases/course/delete-course'
import { CoursesRepository } from '../../api/domain/e-learning/application/repositories/courses-repository'
import { InstructorsRepository } from '../../api/domain/e-learning/application/repositories/instructors-repository'
import { CourseCategorysRepository } from '../../api/domain/e-learning/application/repositories/course-catogories-repository'
import { Instructor } from '../../api/domain/e-learning/enterprise/entities/instructor'
import { Course } from '../../api/domain/e-learning/enterprise/entities/course'
import { CourseCategory } from '../../api/domain/e-learning/enterprise/entities/course-category'
import { UniqueEntityId } from '../../api/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { jest } from '@jest/globals'
import { CourseLevel } from '@/api/domain/e-learning/enterprise/entities/value-objects/course/level'
import { Price } from '@/api/domain/e-learning/enterprise/entities/value-objects/price/price'

describe('DeleteCourseUseCase', () => {
	let coursesRepository: CoursesRepository
	let categoriesRepository: CourseCategorysRepository
	let instructorsRepository: InstructorsRepository
	let useCase: DeleteCourseUseCase

	const fakeCourseId = 'course-1'
	const fakeInstructorId = 'inst-1'

	let instructor: Instructor
	let category: CourseCategory
	let course: Course

	beforeEach(() => {
		instructor = Instructor.create(
			{
				name: 'Instrutor Teste',
				email: 'instrutor.teste@example.com',
				cpf: '12345678901',
				phoneNumber: '11999999999',
				bio: 'Bio',
				createdAt: new Date(),
				updatedAt: new Date(),
				courses: [],
				passwordHash: 'hash',
			},
			new UniqueEntityId(fakeInstructorId),
		)

		category = CourseCategory.create({
			icon: 'icon.png',
			courseCount: 1,
			createdAt: new Date(),
		})

		course = Course.create(
			{
				title: 'Curso',
				description: 'Descrição',
				thumbnailUrl: 'url.jpg',
				duration: 60,
				price: Price.create(100),
				level: CourseLevel.BEGINNER,
				instructorId: instructor.id,
				category,
				modules: [],
			},
			new UniqueEntityId(fakeCourseId),
		)

		instructor.courses.push(course)

		coursesRepository = {
			create: jest.fn(async (_data: Course) => Promise.resolve()),
			findManyByCategoryId: jest.fn(async (_query: any) => Promise.resolve([])),
			findUnique: jest.fn(async () => course),
			save: jest.fn(async (_data: Course) => Promise.resolve()),
			remove: jest.fn(async (_data: Course) => Promise.resolve()),
		}

		instructorsRepository = {
			findUnique: jest.fn(async () => instructor),
			findByEmail: jest.fn(async () => null),
			create: jest.fn(async (_data: Instructor) => {}),
			save: jest.fn(async (_instructor: Instructor) => {}),
			remove: jest.fn(async (_instructor: Instructor) => {}),
		}

		categoriesRepository = {
			findUnique: jest.fn(async () => category),
			findByName: jest.fn(async () => null),
			create: jest.fn(async (data: CourseCategory) => Promise.resolve(data)),
			delete: jest.fn(async (_categoryId: number) => {}),
			save: jest.fn(async (_category: CourseCategory) => Promise.resolve()),
		}

		useCase = new DeleteCourseUseCase(
			coursesRepository,
			categoriesRepository,
			instructorsRepository,
		)
	})

	it('should delete a course successfully', async () => {
		const result = await useCase.execute({
			courseId: fakeCourseId,
			instructorId: fakeInstructorId,
		})

		expect(result.isRight()).toBe(true)
		expect(coursesRepository.remove).toHaveBeenCalledWith(course)
	})

	it('should return error if course not found', async () => {
		coursesRepository.findUnique = jest.fn(async () => null)

		const result = await useCase.execute({
			courseId: 'invalid-course',
			instructorId: fakeInstructorId,
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should return error if instructor not found', async () => {
		instructorsRepository.findUnique = jest.fn(async () => null)

		const result = await useCase.execute({
			courseId: fakeCourseId,
			instructorId: 'invalid-instructor',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should return error if instructor does not own the course', async () => {
		const anotherInstructor = Instructor.create(
			{
				name: 'Outro Instrutor',
				email: 'email@example.com',
				cpf: '11122233344',
				phoneNumber: '11888888888',
				bio: 'Bio',
				createdAt: new Date(),
				updatedAt: new Date(),
				courses: [],
				passwordHash: 'hash',
			},
			new UniqueEntityId('other-inst'),
		)

		instructorsRepository.findUnique = jest.fn(async () => anotherInstructor)

		const result = await useCase.execute({
			courseId: fakeCourseId,
			instructorId: 'other-inst',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})

	it('should return error if category not found', async () => {
		categoriesRepository.findUnique = jest.fn(async () => null)

		const result = await useCase.execute({
			courseId: fakeCourseId,
			instructorId: fakeInstructorId,
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
