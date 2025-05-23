export const STATUS = {
	DRAFT: 1,
	PUBLISHED: 2,
	ARCHIVED: 3,
} as const

export const STATUS_INFO = {
	[STATUS.DRAFT]: {
		label: 'Rascunho',
		value: STATUS.DRAFT,
		key: 'DRAFT',
	},
	[STATUS.PUBLISHED]: {
		label: 'Publicado',
		value: STATUS.PUBLISHED,
		key: 'PUBLISHED',
	},
	[STATUS.ARCHIVED]: {
		label: 'Arquivado',
		value: STATUS.ARCHIVED,
		key: 'ARCHIVED',
	},
}
