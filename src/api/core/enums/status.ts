export enum STATUS {
	DRAFT = 1,
	PUBLISHED = 2,
	ARCHIVED = 3,
}

export const STATUS_INFO = {
	[STATUS.DRAFT]: {
		label: 'Rascunho',
		key: 'DRAFT',
	},
	[STATUS.PUBLISHED]: {
		label: 'Publicado',
		key: 'PUBLISHED',
	},
	[STATUS.ARCHIVED]: {
		label: 'Arquivado',
		key: 'ARCHIVED',
	},
}
