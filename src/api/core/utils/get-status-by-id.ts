import { STATUS, STATUS_INFO } from '../enums/status'

export const STATUS_KEY_TO_ID = Object.entries(STATUS_INFO).reduce(
	(acc, [id, { key }]) => {
		acc[key.toLowerCase()] = Number(id)
		return acc
	},
	{} as Record<string, STATUS>,
)

export function getStatusIdByKey(key: string): STATUS | undefined {
	return STATUS_KEY_TO_ID[key.toLowerCase()]
}
