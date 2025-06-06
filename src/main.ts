import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { Env } from './api/env'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.enableCors({
		origin: (_origin, callback) => {
			callback(null, true)
		},
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		credentials: true,
	})

	const configService: ConfigService<Env, true> = app.get(ConfigService)
	const port = configService.get('PORT', { infer: true })

	await app.listen(port)
}

bootstrap()
