import { ENROLLMENT_INFO, ENROLLMENT_STATUS } from '../enums/enrollment-status'

export const ENROLLMENT_KEY_TO_VALUE = Object.entries(ENROLLMENT_INFO).reduce(
	(acc, [value, { key }]) => {
		acc[key.toLowerCase()] = Number(value)
		return acc
	},
	{} as Record<string, ENROLLMENT_STATUS>,
)

export function getEnrollmentByValue(
	key: string,
): ENROLLMENT_STATUS | undefined {
	return ENROLLMENT_KEY_TO_VALUE[key.toLowerCase()]
}
