import { User } from '../../enterprise/entities/user'
import { UserRole } from '../../enterprise/entities/value-objects/user/role'

export abstract class UsersRepository {
	abstract findUnique(query: AuthenticationQuery): Promise<User | null> // TODO: Corrigir com Prisma
	abstract create(data: CreateUserOptions): Promise<User>
	abstract update(userId: string, data: UpdateUserOptions): Promise<User | null>
	abstract remove(userId: string): Promise<boolean>
}

export abstract class CreateUserOptions {
	abstract email: string
	abstract passwordHash: string
	abstract role: UserRole
	abstract name: string
}

export abstract class UpdateUserOptions {
	abstract email: string
	abstract passwordHash: string
	abstract role: UserRole
	abstract name: string
}

export abstract class AuthenticationQuery {
	abstract id?: string
	abstract email?: string
}
