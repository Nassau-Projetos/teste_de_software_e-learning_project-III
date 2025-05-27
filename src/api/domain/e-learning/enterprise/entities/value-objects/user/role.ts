import { USER_ROLE, USER_ROLE_INFO } from '@/api/core/enums/user-role'
import { getUserRoleByValue } from '@/api/core/utils/get-userRole-by-value'

export class UserRole {
	private constructor(private readonly _value: number) {
		if (_value < 0) {
			throw new Error('User Role cannot be negative')
		}
	}

	get value(): number {
		return this._value
	}

	get key(): string {
		return USER_ROLE_INFO[this._value]?.key ?? 'UNKNOWN'
	}

	get label(): string {
		return USER_ROLE_INFO[this._value]?.label ?? 'Unknown Level'
	}

	toString(): string {
		return this.label
	}

	equals(other: UserRole): boolean {
		return this._value === other.value
	}

	static fromValue(value: USER_ROLE | number | string): UserRole {
		if (typeof value === 'string') {
			const byKey = getUserRoleByValue(value)
			if (byKey) return new UserRole(byKey)

			const parsedNumber = Number(value)
			if (!isNaN(parsedNumber)) return new UserRole(parsedNumber)
		}

		if (typeof value === 'number') return new UserRole(value)

		throw new Error(`Invalid User Role: ${value}`)
	}

	static STUDENT = new UserRole(USER_ROLE.STUDENT)
	static INSTRUCTOR = new UserRole(USER_ROLE.INSTRUCTOR)
	static ADMIN = new UserRole(USER_ROLE.ADMIN)

	static create(value: USER_ROLE) {
		return new UserRole(value)
	}
}
