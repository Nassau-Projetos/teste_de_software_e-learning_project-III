import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { PublishCourseUseCase } from '@/api/domain/e-learning/application/use-cases/course/publish-course'
import { Course } from '@/api/domain/e-learning/enterprise/entities/course'
import { Instructor } from '@/api/domain/e-learning/enterprise/entities/instructor'
import { Price } from '@/api/domain/e-learning/enterprise/entities/value-objects/price/price'
import { CourseLevel } from '@/api/domain/e-learning/enterprise/entities/value-objects/course/level'
import { CoursesRepository } from '@/api/domain/e-learning/application/repositories/courses-repository'
import { InstructorsRepository } from '@/api/domain/e-learning/application/repositories/instructors-repository'

import { jest } from '@jest/globals'
import { CourseCategory } from '@/api/domain/e-learning/enterprise/entities/course-category'

describe('PublishCourseUseCase', () => {
	let coursesRepository: CoursesRepository
	let instructorsRepository: InstructorsRepository
	let useCase: PublishCourseUseCase

	const instructorId = new UniqueEntityId('instructor-1')
	const otherInstructorId = new UniqueEntityId('instructor-2')
	const courseId = new UniqueEntityId('course-1')

	let instructor: Instructor
	let course: Course

	beforeEach(() => {
		const category = CourseCategory.create({
			icon: 'icon.png',
			courseCount: 0,
			createdAt: new Date(),
		})

		instructor = Instructor.create(
			{
				name: 'John Doe',
				email: 'john@example.com',
				cpf: '12345678901',
				phoneNumber: '11999999999',
				bio: 'Bio',
				createdAt: new Date(),
				updatedAt: new Date(),
				courses: [],
				passwordHash: 'hashed',
			},
			instructorId,
		)

		course = Course.create(
			{
				title: 'Curso Teste',
				description: 'Descrição',
				thumbnailUrl: 'thumb.png',
				duration: 100,
				price: Price.create(200),
				level: CourseLevel.BEGINNER,
				instructorId: instructor.id,
				category,
				modules: [],
			},
			courseId,
		)

		coursesRepository = {
			create: jest.fn(async (_data: Course) => {}),
			findUnique: jest.fn(async (_query) => course),
			save: jest.fn(async (_course: Course) => {}),
			remove: jest.fn(async (_course: Course) => {}),
			findManyByCategoryId: jest.fn(async (_query: any) => []),
		}

		instructorsRepository = {
			findUnique: jest.fn(async (_query) => instructor),
			create: jest.fn(async (_data: Instructor) => {}),
			save: jest.fn(async (_instructor: Instructor) => {}),
			findByEmail: jest.fn(async (_query: any) => null),
			remove: jest.fn(async (_instructor: Instructor) => {}),
		}

		useCase = new PublishCourseUseCase(coursesRepository, instructorsRepository)
	})

	it('should publish course if instructor is owner', async () => {
		jest
			.spyOn(instructorsRepository, 'findUnique')
			.mockResolvedValueOnce(instructor)
		jest.spyOn(coursesRepository, 'findUnique').mockResolvedValueOnce(course)

		const result = await useCase.execute({
			instructorId: instructor.id.toString(),
			courseId: course.id.toString(),
		})

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.course).toBe(course)
			expect(coursesRepository.save).toHaveBeenCalledWith(course)
		}
	})

	it('should return ResourceNotFoundError if course does not exist', async () => {
		jest
			.spyOn(instructorsRepository, 'findUnique')
			.mockResolvedValueOnce(instructor)
		jest.spyOn(coursesRepository, 'findUnique').mockResolvedValueOnce(null)

		const result = await useCase.execute({
			instructorId: instructor.id.toString(),
			courseId: course.id.toString(),
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should return ResourceNotFoundError if instructor does not exist', async () => {
		jest.spyOn(instructorsRepository, 'findUnique').mockResolvedValueOnce(null)
		jest.spyOn(coursesRepository, 'findUnique').mockResolvedValueOnce(course)

		const result = await useCase.execute({
			instructorId: 'non-existent',
			courseId: course.id.toString(),
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should return NotAllowedError if instructor is not the owner of the course', async () => {
		const otherInstructor = Instructor.create(
			{
				name: 'Jane Doe',
				email: 'jane@example.com',
				cpf: '98765432100',
				phoneNumber: '11999999999',
				bio: 'Other Bio',
				createdAt: new Date(),
				updatedAt: new Date(),
				courses: [],
				passwordHash: 'hashed',
			},
			otherInstructorId,
		)

		jest
			.spyOn(instructorsRepository, 'findUnique')
			.mockResolvedValueOnce(otherInstructor)
		jest.spyOn(coursesRepository, 'findUnique').mockResolvedValueOnce(course)

		const result = await useCase.execute({
			instructorId: otherInstructor.id.toString(),
			courseId: course.id.toString(),
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
