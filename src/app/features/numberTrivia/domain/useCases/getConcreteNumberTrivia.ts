import * as Either from "fp-ts/Either";

import { Failure } from "../../../../core/error/failures";
import { UseCase } from "../../../../core/useCases/useCase";
import { NumberTrivia } from "../entities/numberTrivia";
import { NumberTriviaRepository } from "../repositories/numberTriviaRepository";

export class GetConcreteNumberTrivia extends UseCase<
  Failure,
  NumberTrivia,
  GetConcreteNumberTriviaParams
> {
  constructor(private repository: NumberTriviaRepository) {
    super();
  }

  async execute(
    params: GetConcreteNumberTriviaParams
  ): Promise<Either.Either<Failure, NumberTrivia>> {
    return await this.repository.getConcreteNumberTrivia(params.number);
  }
}

export interface GetConcreteNumberTriviaParams {
  number: number;
}
