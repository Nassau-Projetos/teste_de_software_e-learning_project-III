import { DomainEvents } from '@/api/core/events/domain-events'
import {
	FindManyInstructorsQuery,
	FindUniqueInstructorQuery,
	InstructorsRepository,
} from '@/api/domain/e-learning/application/repositories/instructors-repository'
import { Instructor } from '@/api/domain/e-learning/enterprise/entities/instructor'

export class InMemoryInstructorsRepository implements InstructorsRepository {
	public items: Instructor[] = []

	async findUnique({
		instructorId,
	}: FindUniqueInstructorQuery): Promise<Instructor | null> {
		const instructor = this.items.find(
			(item) => item.id.toString() === instructorId,
		)

		if (!instructor) {
			return null
		}

		return instructor
	}

	async findByEmail({
		email,
	}: FindUniqueInstructorQuery): Promise<Instructor | null> {
		const instructor = this.items.find(
			(item) => item.email.toString() === email,
		)

		if (!instructor) {
			return null
		}

		return instructor
	}

	async findMany({ params }: FindManyInstructorsQuery): Promise<Instructor[]> {
		const page = params?.page ?? 1
		const limit = params?.limit ?? 20

		const sorted = this.items.sort(
			(a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
		)

		return sorted.slice((page - 1) * limit, page * limit)
	}

	async create(instructor: Instructor): Promise<void> {
		this.items.push(instructor)

		DomainEvents.dispatchEventsForAggregate(instructor.id)
	}

	async save(instructor: Instructor): Promise<void> {
		const itemIndex = this.items.findIndex((item) => item.id === instructor.id)

		this.items[itemIndex] = instructor
	}

	async remove(instructor: Instructor): Promise<void> {
		const itemIndex = this.items.findIndex((item) => item.id === instructor.id)

		this.items.splice(itemIndex, 1)
	}
}
