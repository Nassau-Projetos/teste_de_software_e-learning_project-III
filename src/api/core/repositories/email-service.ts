export abstract class EmailService {
	abstract sendEmail(options: SendEmailOptions): Promise<void>
}

export abstract class SendEmailOptions {
	abstract to: string
	abstract subject: string
	abstract body: string
}
