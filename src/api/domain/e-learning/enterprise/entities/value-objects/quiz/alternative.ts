export class Alternative {
	constructor(
		public readonly id: string,
		public readonly text: string,
	) {}

	equals(other: Alternative) {
		return this.id === other.id
	}
}
