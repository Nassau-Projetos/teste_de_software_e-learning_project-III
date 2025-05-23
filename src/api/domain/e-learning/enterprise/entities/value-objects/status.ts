import { STATUS } from '@/api/core/enums/status'

export class Status {
	private constructor(private readonly _value: number) {
		if (_value < 0) {
			throw new Error('Status não pode ser negativo')
		}
	}

	get value(): number {
		return this._value
	}

	toString(): string {
		return this._value.toString()
	}

	equals(other: Status): boolean {
		return this._value === other.value
	}

	isDraft(): boolean {
		return this.equals(Status.DRAFT)
	}

	isPublished(): boolean {
		return this.equals(Status.PUBLISHED)
	}

	isArchived(): boolean {
		return this.equals(Status.ARCHIVED)
	}

	static DRAFT = new Status(STATUS.DRAFT)
	static PUBLISHED = new Status(STATUS.PUBLISHED)
	static ARCHIVED = new Status(STATUS.ARCHIVED)
}
