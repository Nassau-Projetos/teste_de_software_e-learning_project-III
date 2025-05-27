import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './api/env'
import { AuthModule } from './api/infra/auth/auth.module'
import { HttpModule } from './api/infra/http/http.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: (env) => envSchema.parse(env),
			isGlobal: true,
		}),
		AuthModule,
		HttpModule,
	],
})
export class AppModule {}
