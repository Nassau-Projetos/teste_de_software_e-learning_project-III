import { Either, left, right } from '@/api/core/either/either'
import { NotAllowedError } from '@/api/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/errors/resource-not-found-error'
import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'

interface ChooseQuestionBestAnswerUseCaseRequest {
	authorId: string
	answerId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{ question: Question }
>

export class ChooseQuestionBestAnswerUseCase {
	constructor(
		private answerRepository: AnswersRepository,
		private questionRepository: QuestionsRepository,
	) {}

	async execute({
		authorId,
		answerId,
	}: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
		const answer = await this.answerRepository.findById(answerId)

		if (!answer) {
			return left(new ResourceNotFoundError())
		}

		const question = await this.questionRepository.findById(
			answer.questionId.toString(),
		)

		if (!question) {
			return left(new ResourceNotFoundError())
		}

		if (authorId != question.authorId.toString()) {
			return left(new NotAllowedError())
		}

		question.bestAnswerId = answer.id

		await this.questionRepository.save(question)

		return right({ question })
	}
}
