import { EntityId } from './entity-id'
import { UniqueEntityId } from './value-objects/unique-entity-id'

export abstract class Entity<Props, IdType extends EntityId = UniqueEntityId> {
	protected readonly _id: IdType
	protected readonly props: Props

	protected constructor(props: Props, id?: IdType, createId?: () => IdType) {
		this._id = id ?? createId?.() ?? (new UniqueEntityId() as unknown as IdType)
		this.props = props
	}

	get id(): IdType {
		return this._id
	}

	equals(entity: Entity<unknown, IdType>): boolean {
		return entity.id.equals(this._id)
	}
}

// import { UniqueEntityId } from './value-objects/unique-entity-id'

// export abstract class Entity<Props> {
// 	private _id: UniqueEntityId
// 	protected props: Props

// 	protected constructor(props: Props, id?: UniqueEntityId) {
// 		this._id = id ?? new UniqueEntityId()
// 		this.props = props
// 	}

// 	get id() {
// 		return this._id
// 	}

// 	public equals(entity: Entity<unknown>) {
// 		if (entity === this) {
// 			return true
// 		}

// 		if (entity.id === this._id) {
// 			return true
// 		}

// 		return false
// 	}
// }
