import { UniqueEntityId } from '@/api/core/entities/value-objects/unique-entity-id'
import { ArchiveCourseUseCase } from '../../api/domain/e-learning/application/use-cases/course/archive-course'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Course } from '@/api/domain/e-learning/enterprise/entities/course'
import { Instructor } from '@/api/domain/e-learning/enterprise/entities/instructor'
import { jest } from '@jest/globals'
import { Price } from '@/api/domain/e-learning/enterprise/entities/value-objects/price/price'
import { CourseCategory } from '@/api/domain/e-learning/enterprise/entities/course-category'
import { CourseLevel } from '@/api/domain/e-learning/enterprise/entities/value-objects/course/level'

const createMockCourse = (instructorId: string): any => ({
	instructorId: {
		equals: (id: string) => id === instructorId,
	},
	archive: jest.fn(),
})

const createMockRepositories = () => ({
	courseRepository: {
		create: jest.fn(async (_data: Course) => {}),
		findUnique: jest.fn(async (_query): Promise<Course | null> => null),
		save: jest.fn(async (_course: Course) => {}),
		remove: jest.fn(async (_course: Course) => {}),
		findManyByCategoryId: jest.fn(async (_query: any) => []),
	},
	instructorRepository: {
		findUnique: jest.fn(
			async (_query): Promise<Instructor | null> =>
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
	},
})

describe('ArchiveCourseUseCase', () => {
	it('should return ResourceNotFoundError if course does not exist', async () => {
		const repos = createMockRepositories()
		repos.instructorRepository.findUnique.mockResolvedValue(
			Instructor.create(
				{
					name: 'Instrutor Teste',
					email: 'instrutor.teste@example.com',
					cpf: '12345678901',
					phoneNumber: '11999999999',
					bio: 'Bio do instrutor',
					createdAt: new Date(),
					updatedAt: new Date(),
					courses: [],
					passwordHash: 'hashed-password',
				},
				new UniqueEntityId('instructor-1'),
			),
		)
		repos.courseRepository.findUnique.mockResolvedValue(null)

		const useCase = new ArchiveCourseUseCase(
			repos.courseRepository,
			repos.instructorRepository,
		)

		const result = await useCase.execute({
			courseId: 'course-1',
			instructorId: 'instructor-1',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should return ResourceNotFoundError if instructor does not exist', async () => {
		const repos = createMockRepositories()
		repos.instructorRepository.findUnique.mockResolvedValue(null)
		repos.courseRepository.findUnique.mockResolvedValue(null)

		const useCase = new ArchiveCourseUseCase(
			repos.courseRepository,
			repos.instructorRepository,
		)

		const result = await useCase.execute({
			courseId: 'course-1',
			instructorId: 'instructor-1',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('should return NotAllowedError if instructor is not the course owner', async () => {
		const repos = createMockRepositories()
		const fakeCourse = createMockCourse('other-instructor')

		repos.instructorRepository.findUnique.mockResolvedValue(
			Instructor.create(
				{
					name: 'Instrutor Teste',
					email: 'instrutor.teste@example.com',
					cpf: '12345678901',
					phoneNumber: '11999999999',
					bio: 'Bio do instrutor',
					createdAt: new Date(),
					updatedAt: new Date(),
					courses: [],
					passwordHash: 'hashed-password',
				},
				new UniqueEntityId('instructor-1'),
			),
		)
		repos.courseRepository.findUnique.mockResolvedValue(fakeCourse)

		const useCase = new ArchiveCourseUseCase(
			repos.courseRepository,
			repos.instructorRepository,
		)

		const result = await useCase.execute({
			courseId: 'course-1',
			instructorId: 'instructor-1',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})

	it('should archive the course and return it if instructor is the owner', async () => {
		const repos = createMockRepositories()

		const course = Course.create(
			{
				title: 'Test Course',
				description: 'A test course',
				instructorId: new UniqueEntityId('instructor-1'),
				createdAt: new Date(),
				updatedAt: new Date(),
				thumbnailUrl: '',
				duration: 0,
				price: Price.create(0),
				modules: [],
				level: CourseLevel.BEGINNER,
				category: CourseCategory.create({
					createdAt: new Date(),
					updatedAt: new Date(),
					icon: '',
				}),
			},
			new UniqueEntityId('course-1'),
		)

		const archiveSpy = jest.spyOn(course, 'archive')

		repos.instructorRepository.findUnique.mockResolvedValue(
			Instructor.create(
				{
					name: 'Instrutor Teste',
					email: 'instrutor.teste@example.com',
					cpf: '12345678901',
					phoneNumber: '11999999999',
					bio: 'Bio do instrutor',
					createdAt: new Date(),
					updatedAt: new Date(),
					courses: [],
					passwordHash: 'hashed-password',
				},
				new UniqueEntityId('instructor-1'),
			),
		)

		repos.courseRepository.findUnique.mockResolvedValue(course)

		const useCase = new ArchiveCourseUseCase(
			repos.courseRepository,
			repos.instructorRepository,
		)

		const result = await useCase.execute({
			courseId: 'course-1',
			instructorId: 'instructor-1',
		})

		expect(archiveSpy).toHaveBeenCalled()
		expect(repos.courseRepository.save).toHaveBeenCalledWith(course)
		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({ course })
	})
})
