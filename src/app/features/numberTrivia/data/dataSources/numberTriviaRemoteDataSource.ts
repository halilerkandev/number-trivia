import { NumberTriviaModel } from "../models/numberTriviaModel";

export abstract class NumberTriviaRemoteDataSource {
  /**
   * Calls the http://numbersapi.com/{number}?json endpoint.
   *
   * @param number Trivia number
   * @throws {ServerException} Throws a ServerException for all error code.
   * @returns {Promise} Promise object represents NumberTriviaModel
   */
  abstract getConcreteNumberTrivia(number: number): Promise<NumberTriviaModel>;

  /**
   * Calls the http://numbersapi.com/random/trivia?json endpoint.
   *
   * @throws {ServerException} Throws a ServerException for all error code.
   * @returns {Promise} Promise object represents NumberTriviaModel
   */
  abstract getRandomNumberTrivia(): Promise<NumberTriviaModel>;
}
