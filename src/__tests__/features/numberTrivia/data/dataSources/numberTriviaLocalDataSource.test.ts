import * as Either from "fp-ts/Either";
import { CacheException } from "../../../../../app/core/error/exceptions";
import { CacheFailure } from "../../../../../app/core/error/failures";

jest.mock("../../../../../app/core/storage/secureStorage");
import { ExpoSecureStorage } from "../../../../../app/core/storage/secureStorage";
import { unit } from "../../../../../app/core/utils/unit";

import { ExpoSecureStorageNumberTriviaLocalDataSource } from "../../../../../app/features/numberTrivia/data/dataSources/numberTriviaLocalDataSource";
import { NumberTriviaModel } from "../../../../../app/features/numberTrivia/data/models/numberTriviaModel";
import cachedTrivia from "../../../../testUtils/cachedTrivia.json";

describe("ExpoSecureStorageNumberTriviaLocalDataSource", () => {
  const tKey = "CACHED_NUMBER_TRIVIA";
  const tValue = JSON.stringify(cachedTrivia);
  const tNumberTriviaModel = NumberTriviaModel.fromJson(cachedTrivia);
  const tCacheFailure = new CacheFailure();
  const tCacheException = new CacheException();

  const secureStorage = new ExpoSecureStorage();
  const localDataSource = new ExpoSecureStorageNumberTriviaLocalDataSource(
    secureStorage
  );

  let getItemSpy = jest.spyOn(ExpoSecureStorage.prototype, "getItem");
  let setItemSpy = jest.spyOn(ExpoSecureStorage.prototype, "setItem");

  let getLastNumberTriviaSpy = jest.spyOn(
    ExpoSecureStorageNumberTriviaLocalDataSource.prototype,
    "getLastNumberTrivia"
  );
  let cacheNumberTriviaSpy = jest.spyOn(
    ExpoSecureStorageNumberTriviaLocalDataSource.prototype,
    "cacheNumberTrivia"
  );

  beforeEach(() => {
    getLastNumberTriviaSpy.mockClear();
    cacheNumberTriviaSpy.mockClear();
    getItemSpy.mockClear();
    setItemSpy.mockClear();
  });

  describe("get last number trivia", () => {
    test("should return number trivia from secure storage when there is one in the cache", async () => {
      // arrange
      getItemSpy.mockImplementation(() =>
        Promise.resolve(Either.right(tValue))
      );
      // act
      const result = await localDataSource.getLastNumberTrivia();
      // assert
      expect(secureStorage.getItem).toHaveBeenCalledWith(tKey);
      expect(result).toMatchObject(tNumberTriviaModel);
    });

    test("should throw an exception when there is no cached value", async () => {
      // arrange
      getItemSpy.mockImplementation(() =>
        Promise.resolve(Either.left(tCacheFailure))
      );
      // act
      try {
        await localDataSource.getLastNumberTrivia();
      } catch (error) {
        // assert
        expect(secureStorage.getItem).toHaveBeenCalledWith(tKey);
        expect(error).toMatchObject(tCacheException);
      }
    });
  });

  describe("cache trivia", () => {
    test("should cache number trivia to secure storage", async () => {
      // arrange
      setItemSpy.mockImplementation(() => Promise.resolve(Either.right(unit)));
      // act
      await localDataSource.cacheNumberTrivia(tNumberTriviaModel);
      // assert
      expect(secureStorage.setItem).toHaveBeenCalledWith(tKey, tValue);
    });

    test("should throw an exception when cache trivia to secure storage", async () => {
      // arrange
      setItemSpy.mockImplementation(() =>
        Promise.resolve(Either.left(tCacheFailure))
      );
      // act
      try {
        await localDataSource.cacheNumberTrivia(tNumberTriviaModel);
      } catch (error) {
        // assert
        expect(secureStorage.setItem).toHaveBeenCalledWith(tKey, tValue);
        expect(error).toMatchObject(tCacheException);
      }
    });
  });
});
