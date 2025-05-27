import { UpdateCourseCategoryUseCase } from '@/api/domain/e-learning/application/use-cases/course/update-course-category'
import { CoursesRepository } from '@/api/domain/e-learning/application/repositories/courses-repository'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { jest } from '@jest/globals'
import { Course } from '@/api/domain/e-learning/enterprise/entities/course'
import { Price } from '@/api/domain/e-learning/enterprise/entities/value-objects/price/price'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { CourseLevel } from '@/api/domain/e-learning/enterprise/entities/value-objects/course/level'

describe('UpdateCourseCategoryUseCase', () => {
	let courseRepository: jest.Mocked<CoursesRepository>
	let categoryRepository: any
	let useCase: UpdateCourseCategoryUseCase

	const makeCourse = (overrides = {}) => {
		const category = {
			id: { toNumber: () => 1 },
			...(overrides['category'] || {}),
		}
		const instructorId = overrides['instructorId'] || 'instructor-1'
		const course = Course.create(
			{
				title: 'Test Course',
				description: 'Test Description',
				slug: { value: 'test-course' },
				thumbnailUrl: 'test.jpg',
				duration: 60,
				price: Price.create(100),
				level: CourseLevel.BEGINNER,
				instructorId: new UniqueEntityId(instructorId),
				category,
				modules: [],
			},
			overrides['id'],
		)
		course.changeCategory = jest.fn()
		return Object.assign(course, overrides)
	}

	const makeCategory = (id: number) => ({
		id: { toNumber: () => id },
		decrementCourseCount: jest.fn(),
		incrementCourseCount: jest.fn(),
	})

	beforeEach(() => {
		courseRepository = {
			create: jest.fn(async (_data: Course) => {}),
			findUnique: jest.fn(async (_query) => null),
			save: jest.fn(async (_course: Course) => {}),
			remove: jest.fn(async (_course: Course) => {}),
			findManyByCategoryId: jest.fn(async (_query: any) => []),
		}

		categoryRepository = {
			findUnique: jest.fn(),
			save: jest.fn(),
		}

		useCase = new UpdateCourseCategoryUseCase(
			courseRepository,
			categoryRepository,
		)
	})

	it('should update course category successfully', async () => {
		const course = makeCourse()
		const oldCategory = makeCategory(1)
		const newCategory = makeCategory(2)

		courseRepository.findUnique.mockResolvedValue(course)
		categoryRepository.findUnique
			.mockResolvedValueOnce(oldCategory)
			.mockResolvedValueOnce(newCategory)

		const result = await useCase.execute({
			courseId: 'course-1',
			instructorId: 'instructor-1',
			categoryId: 2,
		})

		expect(result.isRight()).toBe(true)
		expect(oldCategory.decrementCourseCount).toHaveBeenCalled()
		expect(newCategory.incrementCourseCount).toHaveBeenCalled()
		expect(categoryRepository.save).toHaveBeenCalledWith(oldCategory)
		expect(categoryRepository.save).toHaveBeenCalledWith(newCategory)
		expect(course.changeCategory).toHaveBeenCalledWith(newCategory)
		expect(courseRepository.save).toHaveBeenCalledWith(course)
	})

	it('should return ResourceNotFoundError if course is not found', async () => {
		courseRepository.findUnique.mockResolvedValue(null)

		const result = await useCase.execute({
			courseId: 'course-1',
			instructorId: 'instructor-1',
			categoryId: 2,
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should return ResourceNotFoundError if old or new category not found', async () => {
		const course = makeCourse()
		courseRepository.findUnique.mockResolvedValue(course)

		categoryRepository.findUnique.mockResolvedValueOnce(null)

		const result = await useCase.execute({
			courseId: 'course-1',
			instructorId: 'instructor-1',
			categoryId: 2,
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should save course without changing categories if categoryId is the same', async () => {
		const course = makeCourse()
		courseRepository.findUnique.mockResolvedValue(course)

		const result = await useCase.execute({
			courseId: 'course-1',
			instructorId: 'instructor-1',
			categoryId: 1,
		})

		expect(result.isRight()).toBe(true)
		expect(categoryRepository.findUnique).not.toHaveBeenCalled()
		expect(course.changeCategory).not.toHaveBeenCalled()
		expect(categoryRepository.save).not.toHaveBeenCalled()
		expect(courseRepository.save).toHaveBeenCalledWith(course)
	})
})
