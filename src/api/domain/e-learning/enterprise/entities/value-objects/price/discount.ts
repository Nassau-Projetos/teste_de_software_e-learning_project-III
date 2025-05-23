import { Price } from './price'

export class Discount {
	private constructor(
		private readonly _percentage: number,
		private readonly _expiresAt?: Date | null,
	) {
		if (_percentage <= 0 || _percentage >= 100) {
			throw new Error('Desconto deve estar entre 1% e 99%')
		}
	}

	get percentage(): number {
		return this._percentage
	}

	get expiresAt(): Date | null {
		return this._expiresAt ?? null
	}

	isExpired(now: Date = new Date()): boolean {
		return this._expiresAt ? now > this._expiresAt : false
	}

	applyTo(price: Price): Price {
		if (this.isExpired()) {
			throw new Error('Desconto expirado')
		}

		const discounted = price.value * (1 - this._percentage / 100)
		return Price.create(parseFloat(discounted.toFixed(2)))
	}

	static create(props: {
		percentage: number
		expiresAt?: Date | null
	}): Discount {
		return new Discount(props.percentage, props.expiresAt)
	}
}
