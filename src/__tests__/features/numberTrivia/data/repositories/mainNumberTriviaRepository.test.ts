import * as Either from "fp-ts/Either";
import {
  CacheException,
  ServerException,
} from "../../../../../app/core/error/exceptions";
import {
  CacheFailure,
  ServerFailure,
} from "../../../../../app/core/error/failures";

import { NetworkInfo } from "../../../../../app/core/network/networkInfo";
import { NumberTriviaLocalDataSource } from "../../../../../app/features/numberTrivia/data/dataSources/numberTriviaLocalDataSource";
import { NumberTriviaRemoteDataSource } from "../../../../../app/features/numberTrivia/data/dataSources/numberTriviaRemoteDataSource";
import { NumberTriviaModel } from "../../../../../app/features/numberTrivia/data/models/numberTriviaModel";
import { MainNumberTriviaRepository } from "../../../../../app/features/numberTrivia/data/repositories/mainNumberTriviaRepository";
import { NumberTrivia } from "../../../../../app/features/numberTrivia/domain/entities/numberTrivia";

class MockNumberTriviaRemoteDataSource extends NumberTriviaRemoteDataSource {
  getConcreteNumberTrivia(number: number): Promise<NumberTriviaModel> {
    throw new Error("Method not implemented.");
  }
  getRandomNumberTrivia(): Promise<NumberTriviaModel> {
    throw new Error("Method not implemented.");
  }
}

class MockNumberTriviaLocalDataSource extends NumberTriviaLocalDataSource {
  cacheNumberTrivia(triviaToCache: NumberTriviaModel): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getLastNumberTrivia(): Promise<NumberTriviaModel> {
    throw new Error("Method not implemented.");
  }
}

class MockNetworkInfo extends NetworkInfo {
  get isInternetReachable(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

describe("MainNumberTriviaRepository", () => {
  const tNumber = 1;
  const tText = "Test text";
  const tNumberTriviaModel = new NumberTriviaModel(tText, tNumber);
  const tNumberTrivia: NumberTrivia = tNumberTriviaModel;
  const tServerFailure = new ServerFailure();
  const tCacheFailure = new CacheFailure();

  const mockRemoteDataSource = new MockNumberTriviaRemoteDataSource();
  const mockLocalDataSource = new MockNumberTriviaLocalDataSource();
  const mockNetworkInfo = new MockNetworkInfo();
  const repository = new MainNumberTriviaRepository(
    mockRemoteDataSource,
    mockLocalDataSource,
    mockNetworkInfo
  );

  const isInternetReachableMock = jest.spyOn(
    MockNetworkInfo.prototype,
    "isInternetReachable",
    "get"
  );
  const cacheNumberTriviaMock = jest.spyOn(
    MockNumberTriviaLocalDataSource.prototype,
    "cacheNumberTrivia"
  );
  const getConcreteNumberTrivia = jest.spyOn(
    MockNumberTriviaRemoteDataSource.prototype,
    "getConcreteNumberTrivia"
  );
  const getLastNumberTrivia = jest.spyOn(
    MockNumberTriviaLocalDataSource.prototype,
    "getLastNumberTrivia"
  );
  const getRandomNumberTrivia = jest.spyOn(
    MockNumberTriviaRemoteDataSource.prototype,
    "getRandomNumberTrivia"
  );

  beforeEach(() => {
    isInternetReachableMock.mockClear();
    cacheNumberTriviaMock.mockClear();
    getConcreteNumberTrivia.mockClear();
    getLastNumberTrivia.mockClear();
    getRandomNumberTrivia.mockClear();
  });

  describe("getConcreteNumberTrivia", () => {
    test("should check if the device is online", async () => {
      // arrange
      isInternetReachableMock.mockImplementation(() => Promise.resolve(true));
      getConcreteNumberTrivia.mockImplementation(() =>
        Promise.resolve(tNumberTriviaModel)
      );
      cacheNumberTriviaMock.mockImplementation(() => Promise.resolve());
      // act
      await repository.getConcreteNumberTrivia(tNumber);
      // assert
      expect(isInternetReachableMock).toBeCalledTimes(1);
    });

    describe("internet is reachable", () => {
      beforeAll(() => {
        isInternetReachableMock.mockImplementation(() => Promise.resolve(true));
      });

      test("should return remote data when the call to remote data source is successful", async () => {
        // arrange
        getConcreteNumberTrivia.mockImplementation(() =>
          Promise.resolve(tNumberTriviaModel)
        );
        cacheNumberTriviaMock.mockImplementation(() => Promise.resolve());
        // act
        const result = await repository.getConcreteNumberTrivia(tNumber);
        // assert
        expect(getConcreteNumberTrivia).toBeCalledWith(tNumber);
        expect(result).toMatchObject(Either.right(tNumberTrivia));
      });

      test("should cache the data locally when the call to remote data source is successful", async () => {
        // arrange
        getConcreteNumberTrivia.mockImplementation(() =>
          Promise.resolve(tNumberTriviaModel)
        );
        cacheNumberTriviaMock.mockImplementation(() => Promise.resolve());
        // act
        await repository.getConcreteNumberTrivia(tNumber);
        // assert
        expect(mockRemoteDataSource.getConcreteNumberTrivia).toBeCalledWith(
          tNumber
        );
        expect(mockLocalDataSource.cacheNumberTrivia).toBeCalledWith(
          tNumberTriviaModel
        );
      });

      test("should return server exception when the call to remote data source is unsuccessful", async () => {
        // arrange
        getConcreteNumberTrivia.mockImplementation(async () => {
          throw new ServerException();
        });
        cacheNumberTriviaMock.mockImplementation(() => Promise.resolve());
        // act
        const result = await repository.getConcreteNumberTrivia(tNumber);
        // assert
        expect(mockRemoteDataSource.getConcreteNumberTrivia).toBeCalledWith(
          tNumber
        );
        expect(mockLocalDataSource.cacheNumberTrivia).not.toBeCalled();
        expect(result).toMatchObject(Either.left(tServerFailure));
      });
    });

    describe("internet is not reachable", () => {
      beforeAll(() => {
        isInternetReachableMock.mockImplementation(() =>
          Promise.resolve(false)
        );
      });

      test("should return last locally cached data when the cached data is present", async () => {
        // arrange
        getLastNumberTrivia.mockImplementation(() =>
          Promise.resolve(tNumberTriviaModel)
        );
        // act
        const result = await repository.getConcreteNumberTrivia(tNumber);
        // assert
        expect(getConcreteNumberTrivia).not.toBeCalled();
        expect(getLastNumberTrivia).toBeCalledTimes(1);
        expect(result).toMatchObject(Either.right(tNumberTrivia));
      });

      test("should return cached failure when there is no cached data present", async () => {
        // arrange
        getLastNumberTrivia.mockImplementation(async () => {
          throw new CacheException();
        });
        // act
        const result = await repository.getConcreteNumberTrivia(tNumber);
        // assert
        expect(getConcreteNumberTrivia).not.toBeCalled();
        expect(getLastNumberTrivia).toBeCalledTimes(1);
        expect(result).toMatchObject(Either.left(tCacheFailure));
      });
    });
  });

  describe("getRandomNumberTrivia", () => {
    test("should check if the device is online", async () => {
      // arrange
      isInternetReachableMock.mockImplementation(() => Promise.resolve(true));
      getRandomNumberTrivia.mockImplementation(() =>
        Promise.resolve(tNumberTriviaModel)
      );
      cacheNumberTriviaMock.mockImplementation(() => Promise.resolve());
      // act
      await repository.getRandomNumberTrivia();
      // assert
      expect(isInternetReachableMock).toBeCalledTimes(1);
    });

    describe("internet is reachable", () => {
      beforeAll(() => {
        isInternetReachableMock.mockImplementation(() => Promise.resolve(true));
      });

      test("should return remote data when the call to remote data source is successful", async () => {
        // arrange
        getRandomNumberTrivia.mockImplementation(
          async () => await tNumberTriviaModel
        );
        cacheNumberTriviaMock.mockImplementation(() => Promise.resolve());
        // act
        const result = await repository.getRandomNumberTrivia();
        // assert
        expect(getRandomNumberTrivia).toBeCalled();
        expect(result).toMatchObject(Either.right(tNumberTrivia));
      });

      test("should cache the data locally when the call to remote data source is successful", async () => {
        // arrange
        getRandomNumberTrivia.mockImplementation(() =>
          Promise.resolve(tNumberTriviaModel)
        );
        cacheNumberTriviaMock.mockImplementation(() => Promise.resolve());
        // act
        await repository.getRandomNumberTrivia();
        // assert
        expect(mockRemoteDataSource.getRandomNumberTrivia).toBeCalled();
        expect(mockLocalDataSource.cacheNumberTrivia).toBeCalledWith(
          tNumberTriviaModel
        );
      });

      test("should return server exception when the call to remote data source is unsuccessful", async () => {
        // arrange
        getRandomNumberTrivia.mockImplementation(async () => {
          throw new ServerException();
        });
        cacheNumberTriviaMock.mockImplementation(() => Promise.resolve());
        // act
        const result = await repository.getRandomNumberTrivia();
        // assert
        expect(mockRemoteDataSource.getRandomNumberTrivia).toBeCalledTimes(1);
        expect(mockLocalDataSource.cacheNumberTrivia).not.toBeCalled();
        expect(result).toMatchObject(Either.left(tServerFailure));
      });
    });

    describe("internet is not reachable", () => {
      beforeAll(() => {
        isInternetReachableMock.mockImplementation(() =>
          Promise.resolve(false)
        );
      });

      test("should return last locally cached data when the cached data is present", async () => {
        // arrange
        getLastNumberTrivia.mockImplementation(() =>
          Promise.resolve(tNumberTriviaModel)
        );
        // act
        const result = await repository.getRandomNumberTrivia();
        // assert
        expect(getConcreteNumberTrivia).not.toBeCalled();
        expect(getLastNumberTrivia).toBeCalledTimes(1);
        expect(result).toMatchObject(Either.right(tNumberTrivia));
      });

      test("should return cached failure when there is no cached data present", async () => {
        // arrange
        getLastNumberTrivia.mockImplementation(() => {
          throw new CacheException();
        });
        // act
        const result = await repository.getRandomNumberTrivia();
        // assert
        expect(getConcreteNumberTrivia).not.toBeCalled();
        expect(getLastNumberTrivia).toBeCalledTimes(1);
        expect(result).toMatchObject(Either.left(tCacheFailure));
      });
    });
  });
});
