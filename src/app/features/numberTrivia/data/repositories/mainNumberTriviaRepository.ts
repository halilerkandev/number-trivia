import * as Either from "fp-ts/Either";

import {
  CacheFailure,
  Failure,
  ServerFailure,
} from "../../../../core/error/failures";
import { NetworkInfo } from "../../../../core/network/networkInfo";
import { NumberTrivia } from "../../domain/entities/numberTrivia";
import { NumberTriviaRepository } from "../../domain/repositories/numberTriviaRepository";
import { NumberTriviaLocalDataSource } from "../dataSources/numberTriviaLocalDataSource";
import { NumberTriviaRemoteDataSource } from "../dataSources/numberTriviaRemoteDataSource";

export class MainNumberTriviaRepository extends NumberTriviaRepository {
  constructor(
    private remoteDataSource: NumberTriviaRemoteDataSource,
    private localDataSource: NumberTriviaLocalDataSource,
    private networkInfo: NetworkInfo
  ) {
    super();
  }

  async getConcreteNumberTrivia(
    number: number
  ): Promise<Either.Either<Failure, NumberTrivia>> {
    const isInternetReachable = await this.networkInfo.isInternetReachable;

    if (isInternetReachable) {
      try {
        const numberTriviaModel =
          await this.remoteDataSource.getConcreteNumberTrivia(number);
        await this.localDataSource.cacheNumberTrivia(numberTriviaModel);
        return Either.right(numberTriviaModel);
      } catch (error) {
        return Either.left(new ServerFailure());
      }
    }

    try {
      const lastNumberTrivia = await this.localDataSource.getLastNumberTrivia();
      return Either.right(lastNumberTrivia);
    } catch (error) {
      return Either.left(new CacheFailure());
    }
  }

  async getRandomNumberTrivia(): Promise<Either.Either<Failure, NumberTrivia>> {
    const isInternetReachable = await this.networkInfo.isInternetReachable;

    if (isInternetReachable) {
      try {
        const numberTriviaModel =
          await this.remoteDataSource.getRandomNumberTrivia();
        await this.localDataSource.cacheNumberTrivia(numberTriviaModel);
        return Either.right(numberTriviaModel);
      } catch (error) {
        return Either.left(new ServerFailure());
      }
    }

    try {
      const lastNumberTrivia = await this.localDataSource.getLastNumberTrivia();
      return Either.right(lastNumberTrivia);
    } catch (error) {
      return Either.left(new CacheFailure());
    }
  }
}
