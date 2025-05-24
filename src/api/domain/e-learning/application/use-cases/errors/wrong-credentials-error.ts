import { UseCaseError } from '@/api/core/errors/use-case-error'

export class WrongCrenditialsError extends Error implements UseCaseError {
	constructor() {
		super(`Credencials are not valid.`)
	}
}
