export class Price {
	private constructor(private readonly _value: number) {
		if (_value < 0) {
			throw new Error('Preço não pode ser negativo')
		}
	}

	get value(): number {
		return this._value
	}

	toString(): string {
		return this._value.toFixed(2)
	}

	add(price: Price): Price {
		return new Price(this._value + price.value)
	}

	subtract(price: Price): Price {
		const result = this._value - price.value
		if (result < 0) throw new Error('Resultado menor que zero')
		return new Price(result)
	}

	equals(other: Price): boolean {
		return this._value === other.value
	}

	isFree(): boolean {
		return this._value === 0
	}

	static free(): Price {
		return new Price(0)
	}

	static create(value: number): Price {
		return new Price(value)
	}
}
