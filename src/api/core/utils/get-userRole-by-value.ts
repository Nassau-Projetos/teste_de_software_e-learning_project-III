import { USER_ROLE, USER_ROLE_INFO } from '../enums/user-role'

export const USER_ROLE_KEY_TO_VALUE = Object.entries(USER_ROLE_INFO).reduce(
	(acc, [value, { key }]) => {
		acc[key.toLowerCase()] = Number(value)
		return acc
	},
	{} as Record<string, USER_ROLE>,
)

export function getUserRoleByValue(key: string): USER_ROLE | undefined {
	return USER_ROLE_KEY_TO_VALUE[key.toLowerCase()]
}
