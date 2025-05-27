export enum USER_ROLE {
	ADMIN = 1,
	INSTRUCTOR = 2,
	STUDENT = 3,
}

export const USER_ROLE_INFO = {
	[USER_ROLE.ADMIN]: { label: 'Admin', key: 'ADMIN' },
	[USER_ROLE.INSTRUCTOR]: { label: 'Instructor', key: 'INSTRUCTOR' },
	[USER_ROLE.STUDENT]: { label: 'Student', key: 'STUDENT' },
}
