import { IncrementalEntityId } from '@/api/core/entities/value-objects/incremental-entity-id'
import { USER_ROLE } from '@/api/core/enums/user-role'

export class UserRole extends IncrementalEntityId {
	static STUDENT = new UserRole(USER_ROLE.STUDENT)
	static INSTRUCTOR = new UserRole(USER_ROLE.INSTRUCTOR)
	static ADMIN = new UserRole(USER_ROLE.ADMIN)

	static create(value: USER_ROLE) {
		return new UserRole(value)
	}
}
