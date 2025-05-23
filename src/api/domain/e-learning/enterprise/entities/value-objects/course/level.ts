import { LEVEL } from '@/api/core/enums/level'

export class CourseLevel {
	private constructor(private readonly _value: number) {
		if (_value < 0) {
			throw new Error('Level não pode ser negativo')
		}
	}

	get value(): number {
		return this._value
	}

	toString(): string {
		return this._value.toString()
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
		switch (value) {
			case LEVEL.BEGINNER:
			case 'BEGINNER':
			case 1:
				return CourseLevel.BEGINNER

			case LEVEL.INTERMEDIARY:
			case 'INTERMEDIARY':
			case 2:
				return CourseLevel.INTERMEDIARY

			case LEVEL.ADVANCED:
			case 'ADVANCED':
			case 3:
				return CourseLevel.ADVANCED

			default:
				throw new Error(`Nível de curso inválido: ${value}`)
		}
	}

	static BEGINNER = new CourseLevel(LEVEL.BEGINNER)
	static INTERMEDIARY = new CourseLevel(LEVEL.INTERMEDIARY)
	static ADVANCED = new CourseLevel(LEVEL.ADVANCED)
}
