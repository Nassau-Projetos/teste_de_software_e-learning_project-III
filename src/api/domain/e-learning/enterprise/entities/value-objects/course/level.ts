import { LEVEL, LEVEL_INFO } from '@/api/core/enums/level'
import { getLevelByValue } from '@/api/core/utils/get-level-by-value'

export class CourseLevel {
	private constructor(private readonly _value: number) {
		if (_value < 0) {
			throw new Error('Level cannot be negative')
		}
	}

	get value(): number {
		return this._value
	}

	get key(): string {
		return LEVEL_INFO[this._value]?.key ?? 'UNKNOWN'
	}

	get label(): string {
		return LEVEL_INFO[this._value]?.label ?? 'Unknown Level'
	}

	toString(): string {
		return this.label
	}

	equals(other: CourseLevel): boolean {
		return this._value === other.value
	}

	isBeginner() {
		return this.equals(CourseLevel.BEGINNER)
	}

	isIntermediary() {
		return this.equals(CourseLevel.INTERMEDIARY)
	}

	isAdvanced() {
		return this.equals(CourseLevel.ADVANCED)
	}

	static fromValue(value: LEVEL | number | string): CourseLevel {
		if (typeof value === 'string') {
			const byKey = getLevelByValue(value)
			if (byKey) return new CourseLevel(byKey)

			const parsedNumber = Number(value)
			if (!isNaN(parsedNumber)) return new CourseLevel(parsedNumber)
		}

		if (typeof value === 'number') return new CourseLevel(value)

		throw new Error(`Invalid Course Level: ${value}`)
	}

	static BEGINNER = new CourseLevel(LEVEL.BEGINNER)
	static INTERMEDIARY = new CourseLevel(LEVEL.INTERMEDIARY)
	static ADVANCED = new CourseLevel(LEVEL.ADVANCED)
}
