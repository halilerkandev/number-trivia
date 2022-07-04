import * as Either from "fp-ts/Either";

import { Failure } from "../../../../../app/core/error/failures";
import { NumberTrivia } from "../../../../../app/features/numberTrivia/domain/entities/numberTrivia";
import { NumberTriviaRepository } from "../../../../../app/features/numberTrivia/domain/repositories/numberTriviaRepository";
import { GetRandomNumberTrivia } from "../../../../../app/features/numberTrivia/domain/useCases/getRandomNumberTrivia";

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

describe("GetRandomNumberTrivia", () => {
  const tText = "test";
  const tNumber = 1;
  const tNumberTrivia = new NumberTrivia(tText, tNumber);
  const tResult = Either.right(tNumberTrivia);

  const numberTriviaRepository = new MockNumberTriviaRepository();
  const usecase = new GetRandomNumberTrivia(numberTriviaRepository);

  const getRandomNumberTriviaMock = jest.spyOn(
    MockNumberTriviaRepository.prototype,
    "getRandomNumberTrivia"
  );

  test("should get random trivia from repository", async () => {
    // arrange
    getRandomNumberTriviaMock.mockImplementation(() =>
      Promise.resolve(tResult)
    );
    // act
    const result = await usecase.execute();
    // assert
    expect(getRandomNumberTriviaMock).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(tResult);
  });
});
