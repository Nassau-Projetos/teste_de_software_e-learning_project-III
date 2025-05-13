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
}
