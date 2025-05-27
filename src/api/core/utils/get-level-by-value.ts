import { LEVEL, LEVEL_INFO } from '../enums/level'

export const LEVEL_KEY_TO_VALUE = Object.entries(LEVEL_INFO).reduce(
	(acc, [value, { key }]) => {
		acc[key.toLowerCase()] = Number(value)
		return acc
	},
	{} as Record<string, LEVEL>,
)

export function getLevelByValue(key: string): LEVEL | undefined {
	return LEVEL_KEY_TO_VALUE[key.toLowerCase()]
}
