export enum ENROLLMENT_STATUS {
	PENDING = 1,
	ACTIVE = 2,
	CANCELLED = 3,
	COMPLETED = 4,
}

export const ENROLLMENT_INFO = {
	[ENROLLMENT_STATUS.PENDING]: { label: 'pending', key: 'PENDING' },
	[ENROLLMENT_STATUS.ACTIVE]: { label: 'active', key: 'ACTIVE' },
	[ENROLLMENT_STATUS.CANCELLED]: { label: 'cancelled', key: 'CANCELLED' },
	[ENROLLMENT_STATUS.COMPLETED]: { label: 'completed', key: 'COMPLETED' },
}
