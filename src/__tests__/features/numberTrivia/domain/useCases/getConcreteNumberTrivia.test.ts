import * as Either from "fp-ts/Either";

import { Failure } from "../../../../../app/core/error/failures";
import { NumberTrivia } from "../../../../../app/features/numberTrivia/domain/entities/numberTrivia";
import { NumberTriviaRepository } from "../../../../../app/features/numberTrivia/domain/repositories/numberTriviaRepository";
import {
  GetConcreteNumberTrivia,
  GetConcreteNumberTriviaParams,
} from "../../../../../app/features/numberTrivia/domain/useCases/getConcreteNumberTrivia";

class MockNumberTriviaRepository extends NumberTriviaRepository {
  getConcreteNumberTrivia(
    number: number
  ): Promise<Either.Either<Failure, NumberTrivia>> {
    throw new Error("Method not implemented.");
  }
  getRandomNumberTrivia(): Promise<Either.Either<Failure, NumberTrivia>> {
    throw new Error("Method not implemented.");
  }
}

describe("GetConcreteNumberTrivia", () => {
  const tText = "test";
  const tNumber = 1;
  const tNumberTrivia = new NumberTrivia(tText, tNumber);
  const tResult = Either.right(tNumberTrivia);
  const tParams: GetConcreteNumberTriviaParams = {
    number: tNumber,
  };

  const numberTriviaRepository = new MockNumberTriviaRepository();
  const usecase = new GetConcreteNumberTrivia(numberTriviaRepository);

  const getConcreteNumberTriviaMock = jest.spyOn(
    MockNumberTriviaRepository.prototype,
    "getConcreteNumberTrivia"
  );

  test("should get trivia for the number from repository", async () => {
    // arrange
    getConcreteNumberTriviaMock.mockImplementation(() =>
      Promise.resolve(tResult)
    );
    // act
    const result = await usecase.execute(tParams);
    // assert
    expect(getConcreteNumberTriviaMock).toHaveBeenCalledTimes(1);
    expect(getConcreteNumberTriviaMock).toBeCalledWith(tNumber);
    expect(result).toMatchObject(tResult);
  });
});
