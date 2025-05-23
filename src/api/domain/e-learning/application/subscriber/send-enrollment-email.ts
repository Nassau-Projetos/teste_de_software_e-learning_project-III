import { DomainEvents } from '@/api/core/events/domain-events'
import { EventHandler } from '@/api/core/events/event-handler'
import { EmailService } from '../../../../core/repositories/email-service'
import { EnrollmentActivedEvent } from '../../enterprise/events/enrollment-actived-event'
import { CoursesRepository } from '../repositories/courses-repository'
import { StudentsRepository } from '../repositories/students-repository'

export class SendEnrollmentEmailHandler implements EventHandler {
	constructor(
		private readonly emailService: EmailService,
		private readonly studentsRepository: StudentsRepository,
		private readonly coursesRepository: CoursesRepository,
	) {}

	setupSubscriptions(): void {
		DomainEvents.register(
			this.sendEmail.bind(this),
			EnrollmentActivedEvent.name,
		)
	}

	private async sendEmail(event: EnrollmentActivedEvent) {
		const student = await this.studentsRepository.findUnique({
			studentId: event.studentId.toString(),
		})
		const course = await this.coursesRepository.findUnique({
			courseId: event.courseId.toString(),
		})

		if (!student || !course) return

		try {
			await this.emailService.sendEmail({
				to: student.email,
				subject: `Bem-vindo ao curso ${course.title}`,
				body: `<p>Olá ${student.name}, você foi inscrito com sucesso!</p>`,
			})
		} catch (error) {
			console.error(
				`[Email Failure] Erro ao enviar e-mail de inscrição para ${student.email}:`,
				error,
			)
		}
	}
}
