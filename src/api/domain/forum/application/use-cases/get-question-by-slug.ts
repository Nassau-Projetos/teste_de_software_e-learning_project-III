import { Either, right } from '@/api/core/either/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

interface GetQuestionBySlugUseCaseRequest {
	slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<
	null,
	{
		question: Question
	}
>

export class GetQuestionBySlugUseCase {
	constructor(private questionRepository: QuestionsRepository) {}

	async execute({
		slug,
	}: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
		const question = await this.questionRepository.findBySlug(slug)

		if (!question) {
			throw new Error('Question not found.')
		}

		return right({ question })
	}
}
