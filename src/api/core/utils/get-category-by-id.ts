import { CATEGORY, CATEGORY_INFO } from '../enums/category'

export const CATEGORY_KEY_TO_ID = Object.entries(CATEGORY_INFO).reduce(
	(acc, [id, { key }]) => {
		acc[key.toLowerCase()] = Number(id)
		return acc
	},
	{} as Record<string, CATEGORY>,
)

export function getCategoryIdByKey(key: string): CATEGORY | undefined {
	return CATEGORY_KEY_TO_ID[key.toLowerCase()]
}
