// import nodemailer from 'nodemailer'
// import {
// 	EmailService,
// 	SendEmailOptions,
// } from '../../core/repositories/email-service'

// export class NodemailerEmailService implements EmailService {
// 	//TODO: Talvez Remover
// 	private transporter = nodemailer.createTransport({
// 		host: 'smtp.example.com',
// 		port: 587,
// 		secure: false,
// 		auth: {
// 			user: 'your_user',
// 			pass: 'your_pass',
// 		},
// 	})

// 	async sendEmail({ to, subject, body }: SendEmailOptions): Promise<void> {
// 		await this.transporter.sendMail({
// 			from: '"Your App" <no-reply@example.com>',
// 			to,
// 			subject,
// 			html: body,
// 		})
// 	}
// }
