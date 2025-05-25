import { UseCaseError } from '@/api/core/errors/use-case-error'

export class CourseNotPublishedError extends Error implements UseCaseError {
	constructor() {
		super('Course not published')
	}
}
