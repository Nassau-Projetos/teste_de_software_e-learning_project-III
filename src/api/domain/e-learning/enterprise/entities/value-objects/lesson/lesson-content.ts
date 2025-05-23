export type LessonContentType = 'video' | 'text' | 'pdf' | 'link' | 'embed'

interface LessonContentProps {
	type: LessonContentType
	value: string
}

export class LessonContent {
	private constructor(private readonly props: LessonContentProps) {
		this.validate()
	}

	get type() {
		return this.props.type
	}

	get value() {
		return this.props.value
	}

	public static create(props: LessonContentProps): LessonContent {
		return new LessonContent(props)
	}

	private validate() {
		if (!this.props.value || this.props.value.trim().length === 0) {
			throw new Error('Conteúdo não pode ser vazio')
		}

		if (!['video', 'text', 'pdf', 'link', 'embed'].includes(this.props.type)) {
			throw new Error(`Tipo de conteúdo inválido: ${this.props.type}`)
		}
	}

	equals(other: LessonContent): boolean {
		return this.type === other.type && this.value === other.value
	}
}
