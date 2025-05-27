import { DomainEvents } from '@/api/core/events/domain-events'
import {
	FindUniqueStudentQuery,
	StudentsRepository,
} from '@/api/domain/e-learning/application/repositories/students-repository'
import { Student } from '@/api/domain/e-learning/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
	public items: Student[] = []

	async findUnique({
		studentId,
	}: FindUniqueStudentQuery): Promise<Student | null> {
		const student = this.items.find((item) => item.id.toString() === studentId)

		if (!student) {
			return null
		}

		return student
	}

	async findByEmail({
		email,
	}: FindUniqueStudentQuery): Promise<Student | null> {
		const student = this.items.find((item) => item.email.toString() === email)

		if (!student) {
			return null
		}

		return student
	}

	async create(student: Student): Promise<void> {
		this.items.push(student)

		DomainEvents.dispatchEventsForAggregate(student.id)
	}

	async save(student: Student): Promise<void> {
		const itemIndex = this.items.findIndex((item) => item.id === student.id)

		this.items[itemIndex] = student
	}

	async remove(student: Student): Promise<void> {
		const itemIndex = this.items.findIndex((item) => item.id === student.id)

		this.items.splice(itemIndex, 1)
	}
}
