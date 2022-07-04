import * as Either from "fp-ts/Either";

import { Failure } from "../../../../core/error/failures";
import { NumberTrivia } from "../entities/numberTrivia";

export abstract class NumberTriviaRepository {
  abstract getConcreteNumberTrivia(
    number: number
  ): Promise<Either.Either<Failure, NumberTrivia>>;

  abstract getRandomNumberTrivia(): Promise<
    Either.Either<Failure, NumberTrivia>
  >;
}
