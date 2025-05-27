import { GetCourseBySlugUseCase } from '@/api/domain/e-learning/application/use-cases/course/get-course-by-slug'
import { CoursesRepository } from '@/api/domain/e-learning/application/repositories/courses-repository'
import { Course } from '@/api/domain/e-learning/enterprise/entities/course'
import { CourseCategory } from '@/api/domain/e-learning/enterprise/entities/course-category'
import { Instructor } from '@/api/domain/e-learning/enterprise/entities/instructor'
import { CourseLevel } from '@/api/domain/e-learning/enterprise/entities/value-objects/course/level'
import { Price } from '@/api/domain/e-learning/enterprise/entities/value-objects/price/price'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'

import { jest } from '@jest/globals'
import { Slug } from '@/api/domain/e-learning/enterprise/entities/value-objects/slug/slug'

describe('GetCourseBySlugUseCase', () => {
	let coursesRepository: CoursesRepository
	let useCase: GetCourseBySlugUseCase
	let course: Course

	const courseSlug = 'curso-teste'

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
				slug: Slug.create(courseSlug),
				description: 'Descrição',
				thumbnailUrl: 'img.jpg',
				duration: 120,
				price: Price.create(200),
				level: CourseLevel.BEGINNER,
				instructorId: instructor.id,
				category,
				modules: [],
			},
			new UniqueEntityId('course-id-1'),
		)

		coursesRepository = {
			create: jest.fn(async (_data: Course) => {}),
			findUnique: jest.fn(async (_query) => course),
			save: jest.fn(async (_course: Course) => {}),
			remove: jest.fn(async (_course: Course) => {}),
			findManyByCategoryId: jest.fn(async (_query: any) => []),
		}

		useCase = new GetCourseBySlugUseCase(coursesRepository)
	})

	it('should return a course if slug exists', async () => {
		jest.spyOn(coursesRepository, 'findUnique').mockResolvedValueOnce(course)

		const result = await useCase.execute({ slug: courseSlug })

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.course).toEqual(course)
		}
		expect(coursesRepository.findUnique).toHaveBeenCalledWith({
			slug: courseSlug,
		})
	})

	it('should return ResourceNotFoundError if course not found', async () => {
		jest.spyOn(coursesRepository, 'findUnique').mockResolvedValueOnce(null)

		const result = await useCase.execute({ slug: 'slug-inexistente' })

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
