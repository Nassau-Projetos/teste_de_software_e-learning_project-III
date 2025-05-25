import { HashComparer } from '@/api/domain/e-learning/cryptography/hash-comparer'
import { HashGenerator } from '@/api/domain/e-learning/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
	private HASH_SALT_LENGHT = 8

	async hash(plain: string): Promise<string> {
		return hash(plain, this.HASH_SALT_LENGHT)
	}

	async compare(plain: string, hash: string): Promise<boolean> {
		return compare(plain, hash)
	}
}
