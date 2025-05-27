import { UpdateCourseUseCase } from '@/api/domain/e-learning/application/use-cases/course/update-course'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { jest } from '@jest/globals'
import { Course } from '../../api/domain/e-learning/enterprise/entities/course'
import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { Price } from '@/api/domain/e-learning/enterprise/entities/value-objects/price/price'
import { CourseLevel } from '@/api/domain/e-learning/enterprise/entities/value-objects/course/level'
import { CoursesRepository } from '@/api/domain/e-learning/application/repositories/courses-repository'
import { IncrementalEntityId } from '@/api/core/entities/value-objects/incremental-entity-id'
import { LEVEL } from '@/api/core/enums/level'

describe('UpdateCourseUseCase', () => {
	let courseRepository: jest.Mocked<CoursesRepository>
	let useCase: UpdateCourseUseCase

	const makeCourse = ({
		instructorId = 'instructor-1',
		id = undefined,
		...overrides
	} = {}) => {
		const course = Course.create(
			{
				title: 'Initial Title',
				description: 'Initial Description',
				slug: { value: 'initial-slug' },
				thumbnailUrl: 'initial.jpg',
				duration: 60,
				price: Price.create(100),
				level: CourseLevel.BEGINNER,
				instructorId: new UniqueEntityId(instructorId),
				category: {
					props: {
						id: new IncrementalEntityId(1),
						_id: new IncrementalEntityId(1),
						name: 'Category Name',
						key: 'category-key',
						icon: 'icon.png',
						courseCount: 0,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
					equals: jest.fn().mockReturnValue(true),
					touch: jest.fn(),
					incrementCourseCount: jest.fn(),
					decrementCourseCount: jest.fn(),
					updateDetails: jest.fn(),
				} as any,
				modules: [],
			},
			id ? new UniqueEntityId(id) : undefined,
		)

		course.updateDetails = jest.fn()
		course.changePrice = jest.fn()
		course.changeLevel = jest.fn()

		return course
	}

	beforeEach(() => {
		courseRepository = {
			create: jest.fn(),
			findUnique: jest.fn(),
			save: jest.fn(),
			remove: jest.fn(),
			findManyByCategoryId: jest.fn(),
		}

		useCase = new UpdateCourseUseCase(courseRepository)
	})

	it('should return ResourceNotFoundError if course is not found', async () => {
		courseRepository.findUnique.mockResolvedValue(null)

		const result = await useCase.execute({
			courseId: 'course-1',
			instructorId: 'instructor-1',
			data: {},
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should return NotAllowedError if instructorId does not match', async () => {
		const course = makeCourse({ instructorId: 'other-instructor' })
		courseRepository.findUnique.mockResolvedValue(course)

		const result = await useCase.execute({
			courseId: 'course-1',
			instructorId: 'instructor-1',
			data: {},
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})

	it('should update course details without changing price or level if those are undefined', async () => {
		const course = makeCourse()
		courseRepository.findUnique.mockResolvedValue(course)

		const updateData = {
			title: 'Updated Title',
			description: 'Updated Description',
			thumbnailUrl: 'updated.jpg',
			duration: 120,
		}

		const result = await useCase.execute({
			courseId: 'course-1',
			instructorId: 'instructor-1',
			data: updateData,
		})

		expect(result.isRight()).toBe(true)
		expect(course.updateDetails).toHaveBeenCalledWith(updateData)
		expect(course.changePrice).not.toHaveBeenCalled()
		expect(course.changeLevel).not.toHaveBeenCalled()
		expect(courseRepository.save).toHaveBeenCalledWith(course)
	})

	it('should change price correctly when price is provided', async () => {
		const course = makeCourse()
		courseRepository.findUnique.mockResolvedValue(course)

		await useCase.execute({
			courseId: 'course-1',
			instructorId: 'instructor-1',
			data: { price: 0 },
		})

		expect(course.changePrice).toHaveBeenCalledWith(Price.free())

		await useCase.execute({
			courseId: 'course-1',
			instructorId: 'instructor-1',
			data: { price: 150 },
		})

		expect(course.changePrice).toHaveBeenCalledWith(Price.create(150))
	})

	it('should change level correctly when level is provided', async () => {
		const course = makeCourse()
		courseRepository.findUnique.mockResolvedValue(course)

		const levelValue = LEVEL.ADVANCED

		const result = await useCase.execute({
			courseId: 'course-1',
			instructorId: 'instructor-1',
			data: { level: levelValue.toString() },
		})

		expect(course.changeLevel).toHaveBeenCalledWith(
			CourseLevel.fromValue(levelValue),
		)
		expect(result.isRight()).toBe(true)
	})
})
