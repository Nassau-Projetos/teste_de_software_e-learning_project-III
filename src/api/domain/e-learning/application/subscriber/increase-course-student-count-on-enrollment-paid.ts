import { DomainEvents } from '@/api/core/events/domain-events'
import { EventHandler } from '@/api/core/events/event-handler'
import { EnrollmentActivedEvent } from '../../enterprise/events/enrollment-actived-event'
import { CoursesRepository } from '../repositories/courses-repository'

export class IncreaseCourseStudentCountOnEnrollmentPaid
	implements EventHandler
{
	constructor(private readonly courseRepository: CoursesRepository) {}

	setupSubscriptions(): void {
		DomainEvents.register(
			this.increaseStudentCount.bind(this),
			EnrollmentActivedEvent.name,
		)
	}

	private async increaseStudentCount(event: EnrollmentActivedEvent) {
		const course = await this.courseRepository.findUnique({
			courseId: event.courseId.toString(),
		})

		if (!course) return

		course.incrementstudentsCount()
		await this.courseRepository.save(course)
	}
}
