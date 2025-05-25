import { UseCaseError } from '@/api/core/errors/use-case-error'

export class InvalidCategoryError extends Error implements UseCaseError {
	constructor(categoryKey: string) {
		super(`Invalid category ${categoryKey}.`)
	}
}
