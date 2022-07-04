import * as Either from "fp-ts/Either";
import * as Json from "fp-ts/Json";

import { CacheException } from "../../../../core/error/exceptions";
import { CacheFailure } from "../../../../core/error/failures";

import { ExpoSecureStorage } from "../../../../core/storage/secureStorage";
import { NumberTriviaModel } from "../models/numberTriviaModel";

export abstract class NumberTriviaLocalDataSource {
  /**
   * Gets the cached NumberTriviaModel which was gotten the last time
   * the user had an internet connection.
   *
   * @throws {CacheException} If no cached data is present.
   * @returns {Promise} Promise object represents NumberTriviaModel
   */
  abstract getLastNumberTrivia(): Promise<NumberTriviaModel>;

  /**
   * Calls the http://numbersapi.com/{number}?json endpoint.
   *
   * @param {Object} triviaToCache An instance of NumberTriviaModel
   * @throws {CacheException} Throws a CacheException for all error code.
   * @returns {Promise} Promise void
   */
  abstract cacheNumberTrivia(triviaToCache: NumberTriviaModel): Promise<void>;
}

export class ExpoSecureStorageNumberTriviaLocalDataSource extends NumberTriviaLocalDataSource {
  private key = "CACHED_NUMBER_TRIVIA";

  constructor(private expoSecureStorage: ExpoSecureStorage) {
    super();
  }

  async getLastNumberTrivia(): Promise<NumberTriviaModel> {
    const result = await this.expoSecureStorage.getItem(this.key);
    return Either.fold<CacheFailure, string, NumberTriviaModel>(
      () => {
        throw new CacheException();
      },
      (value) => {
        const json: Json.JsonRecord = JSON.parse(value);
        return NumberTriviaModel.fromJson(json);
      }
    )(result);
  }

  async cacheNumberTrivia(triviaToCache: NumberTriviaModel): Promise<void> {
    const json = triviaToCache.toJson();
    const result = await this.expoSecureStorage.setItem(
      this.key,
      JSON.stringify(json)
    );
    Either.mapLeft(() => {
      throw new CacheException();
    })(result);
  }
}
