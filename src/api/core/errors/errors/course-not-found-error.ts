import { UseCaseError } from '../use-case-error'

export class CourseNotFoundError extends Error implements UseCaseError {
	constructor() {
		super('Course not found')
	}
}
