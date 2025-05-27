export enum CATEGORY {
	DESENVOLVIMENTO_WEB = 1,
	FRONT_END = 2,
	BACK_END = 3,
	MOBILE = 4,
	DESIGN = 5,
	VIDEO = 6,
}

export const CATEGORY_INFO = {
	[CATEGORY.DESENVOLVIMENTO_WEB]: {
		label: 'Desenvolvimento Web',
		key: 'DESENVOLVIMENTO_WEB',
	},
	[CATEGORY.FRONT_END]: { label: 'Frontend', key: 'FRONT_END' },
	[CATEGORY.BACK_END]: { label: 'Backend', key: 'BACK_END' },
	[CATEGORY.MOBILE]: { label: 'Mobile', key: 'MOBILE' },
	[CATEGORY.DESIGN]: { label: 'UI/UX Design', key: 'DESIGN' },
	[CATEGORY.VIDEO]: { label: 'Video & Motion', key: 'VIDEO' },
}
