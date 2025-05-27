import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { makeCourseCategory } from '@/tests/factories/make-course-category'
import { makeInstructor } from '@/tests/factories/make-instructor'
import { InMemoryCourseCategorysRepository } from '@/tests/repositories/in-memory-course-category-repository'
import { InMemoryCoursesRepository } from '@/tests/repositories/in-memory-course-repository'
import { InMemoryInstructorsRepository } from '@/tests/repositories/in-memory-instructor-repository'
import { CreateCourseUseCase } from './create-course'

describe('Create Course', () => {
	let coursesRepository: InMemoryCoursesRepository
	let instructorsRepository: InMemoryInstructorsRepository
	let categoriesRepository: InMemoryCourseCategorysRepository
	let sut: CreateCourseUseCase

	beforeEach(() => {
		coursesRepository = new InMemoryCoursesRepository()
		instructorsRepository = new InMemoryInstructorsRepository()
		categoriesRepository = new InMemoryCourseCategorysRepository()
		sut = new CreateCourseUseCase(
			coursesRepository,
			categoriesRepository,
			instructorsRepository,
		)
	})

	it('should create a course when instructor and category exist', async () => {
		const instructor = makeInstructor()
		const category = makeCourseCategory({ icon: 'icon' })

		instructorsRepository.create(instructor)
		categoriesRepository.create(category)

		const result = await sut.execute({
			instructorId: instructor.id.toString(),
			title: 'Curso de Teste',
			description: 'Descrição do curso',
			thumbnailUrl: 'http://example.com/thumb.jpg',
			duration: 120,
			price: 150,
			categoryId: 1,
			level: 'beginner',
		})

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.course.title).toBe('Curso de Teste')
			expect(result.value.instructorName).toBe(instructor.name)
		}

		expect(coursesRepository.items).toHaveLength(1)
	})

	it('should fail if instructor does not exist', async () => {
		const category = makeCourseCategory({ icon: 'icon1' })
		categoriesRepository.create(category)

		const result = await sut.execute({
			instructorId: 'non-existent-id',
			title: 'Curso de Teste',
			description: 'Descrição do curso',
			thumbnailUrl: 'http://example.com/thumb.jpg',
			duration: 120,
			price: 150,
			categoryId: 1,
			level: 'beginner',
		})

		expect(result.isLeft()).toBe(true)
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError)
		}

		expect(coursesRepository.items).toHaveLength(0)
	})

	it('should fail if category does not exist', async () => {
		const instructor = makeInstructor()
		instructorsRepository.create(instructor)

		const result = await sut.execute({
			instructorId: instructor.id.toString(),
			title: 'Curso de Teste',
			description: 'Descrição do curso',
			thumbnailUrl: 'http://example.com/thumb.jpg',
			duration: 120,
			price: 150,
			categoryId: 999, // inexistente
			level: 'beginner',
		})

		expect(result.isLeft()).toBe(true)
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError)
		}

		expect(coursesRepository.items).toHaveLength(0)
	})
})
