import * as Either from "fp-ts/Either";

import { Failure } from "../../../../core/error/failures";
import { UseCase } from "../../../../core/useCases/useCase";
import { NumberTrivia } from "../entities/numberTrivia";
import { NumberTriviaRepository } from "../repositories/numberTriviaRepository";

export class GetRandomNumberTrivia extends UseCase<Failure, NumberTrivia> {
  constructor(private repository: NumberTriviaRepository) {
    super();
  }

  async execute(): Promise<Either.Either<Failure, NumberTrivia>> {
    return await this.repository.getRandomNumberTrivia();
  }
}
