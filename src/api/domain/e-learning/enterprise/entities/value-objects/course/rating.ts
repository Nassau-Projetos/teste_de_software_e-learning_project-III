import { CourseRating } from '../../course-rating'

export class Rating {
	constructor(
		readonly average: number,
		readonly count: number,
	) {}

	static fromRatings(ratings: CourseRating[]): Rating {
		const count = ratings.length

		if (count === 0) return new Rating(0, 0)

		const total = ratings.reduce((sum, r) => sum + r.value, 0)
		const average = Number((total / count).toFixed(1))

		return new Rating(average, count)
	}

	static fromPrimitives(average: number, count: number): Rating {
		return new Rating(average, count)
	}
}
