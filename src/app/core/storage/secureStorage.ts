import {
  getItemAsync,
  setItemAsync,
  deleteItemAsync,
  isAvailableAsync,
  SecureStoreOptions,
} from "expo-secure-store";
import * as Either from "fp-ts/Either";

import { CacheFailure } from "../error/failures";
import { unit, Unit } from "../utils/unit";

export abstract class SecureStorage {
  abstract getItem(
    key: string,
    options?: any
  ): Promise<Either.Either<CacheFailure, string>>;
  abstract setItem(
    key: string,
    value: string,
    options?: any
  ): Promise<Either.Either<CacheFailure, Unit>>;
  abstract deleteItem(
    key: string,
    options?: any
  ): Promise<Either.Either<CacheFailure, Unit>>;
  abstract isAvailable(): Promise<boolean>;
}

export class ExpoSecureStorage extends SecureStorage {
  async getItem(
    key: string,
    options?: SecureStoreOptions
  ): Promise<Either.Either<CacheFailure, string>> {
    try {
      const result: string | null = await getItemAsync(key, options);
      return result ? Either.right(result) : Either.left(new CacheFailure());
    } catch (error) {
      return Either.left(new CacheFailure());
    }
  }

  async setItem(
    key: string,
    value: string,
    options?: SecureStoreOptions
  ): Promise<Either.Either<CacheFailure, Unit>> {
    try {
      await setItemAsync(key, value, options);
      return Either.right(unit);
    } catch (error) {
      return Either.left(new CacheFailure());
    }
  }

  async deleteItem(
    key: string,
    options?: SecureStoreOptions
  ): Promise<Either.Either<CacheFailure, Unit>> {
    try {
      await deleteItemAsync(key, options);
      return Either.right(unit);
    } catch (error) {
      return Either.left(new CacheFailure());
    }
  }

  async isAvailable(): Promise<boolean> {
    return await isAvailableAsync();
  }
}
