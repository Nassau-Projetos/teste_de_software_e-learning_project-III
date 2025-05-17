import { IncrementalEntityId } from '@/api/core/entities/value-objects/incremental-entity-id'
import { LEVEL } from '@/api/core/enums/level'

export class CourseLevel extends IncrementalEntityId {
	static BEGINNER = new CourseLevel(LEVEL.BEGINNER)
	static INTERMEDIARY = new CourseLevel(LEVEL.INTERMEDIARY)
	static ADVANCED = new CourseLevel(LEVEL.ADVANCED)

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
}
