import * as Either from "fp-ts/Either";
jest.mock("expo-secure-store");
import {
  getItemAsync,
  setItemAsync,
  deleteItemAsync,
  isAvailableAsync,
} from "expo-secure-store";

import { ExpoSecureStorage } from "../../../app/core/storage/secureStorage";
import { CacheFailure } from "../../../app/core/error/failures";
import { unit } from "../../../app/core/utils/unit";

describe("SecureStorage", () => {
  const expoSecureStorage = new ExpoSecureStorage();
  const tKey = "key";
  const tValue = "value";
  const tCacheFailure = new CacheFailure();

  const getItemAsyncMock = (getItemAsync as jest.Mock).mockImplementation(() =>
    Promise.resolve(tValue)
  );
  const setItemAsyncMock = (setItemAsync as jest.Mock).mockImplementation(() =>
    Promise.resolve()
  );
  const deleteItemAsyncMock = (deleteItemAsync as jest.Mock).mockImplementation(
    () => Promise.resolve()
  );
  const isAvailableAsyncMock = (
    isAvailableAsync as jest.Mock
  ).mockImplementation(() => Promise.resolve(true));

  jest.spyOn(ExpoSecureStorage.prototype, "getItem");
  jest.spyOn(ExpoSecureStorage.prototype, "setItem");
  jest.spyOn(ExpoSecureStorage.prototype, "deleteItem");
  jest.spyOn(ExpoSecureStorage.prototype, "isAvailable");

  describe("Get item", () => {
    test("should get item from cache successfully", async () => {
      // act
      const result = await expoSecureStorage.getItem(tKey);
      // assert
      expect(expoSecureStorage.getItem).toHaveBeenCalledTimes(1);
      expect(expoSecureStorage.getItem).toHaveBeenCalledWith(tKey);
      expect(result).toMatchObject(Either.right(tValue));
    });

    test("should get null item successfully", async () => {
      // assert
      getItemAsyncMock.mockImplementation(() => Promise.resolve(null));
      // act
      const result = await expoSecureStorage.getItem(tKey);
      // assert
      expect(expoSecureStorage.getItem).toHaveBeenCalledTimes(1);
      expect(expoSecureStorage.getItem).toHaveBeenCalledWith(tKey);
      expect(result).toMatchObject(Either.left(tCacheFailure));
    });

    test("should get error", async () => {
      // assert
      getItemAsyncMock.mockImplementation(() => {
        throw Error();
      });
      // act
      const result = await expoSecureStorage.getItem(tKey);
      // assert
      expect(expoSecureStorage.getItem).toHaveBeenCalledTimes(1);
      expect(expoSecureStorage.getItem).toHaveBeenCalledWith(tKey);
      expect(result).toMatchObject(Either.left(tCacheFailure));
    });
  });

  describe("Set item", () => {
    test("should set item to cache successfully", async () => {
      // act
      const result = await expoSecureStorage.setItem(tKey, tValue);
      // assert
      expect(expoSecureStorage.setItem).toHaveBeenCalledTimes(1);
      expect(expoSecureStorage.setItem).toHaveBeenCalledWith(tKey, tValue);
      expect(result).toMatchObject(Either.right(unit));
    });

    test("should set item to cache unsuccessfully", async () => {
      // arrange
      setItemAsyncMock.mockImplementation(() => {
        throw Error();
      });
      // act
      const result = await expoSecureStorage.setItem(tKey, tValue);
      // assert
      expect(expoSecureStorage.setItem).toHaveBeenCalledTimes(1);
      expect(expoSecureStorage.setItem).toHaveBeenCalledWith(tKey, tValue);
      expect(result).toMatchObject(Either.left(tCacheFailure));
    });
  });

  describe("Delete item", () => {
    test("should delete item from cache successfully", async () => {
      // act
      const result = await expoSecureStorage.deleteItem(tKey);
      // assert
      expect(expoSecureStorage.deleteItem).toHaveBeenCalledTimes(1);
      expect(expoSecureStorage.deleteItem).toHaveBeenCalledWith(tKey);
      expect(result).toMatchObject(Either.right(unit));
    });

    test("should delete item from cache unsuccessfully", async () => {
      // arrange
      deleteItemAsyncMock.mockImplementation(() => {
        throw Error();
      });
      // act
      const result = await expoSecureStorage.deleteItem(tKey);
      // assert
      expect(expoSecureStorage.deleteItem).toHaveBeenCalledTimes(1);
      expect(expoSecureStorage.deleteItem).toHaveBeenCalledWith(tKey);
      expect(result).toMatchObject(Either.left(tCacheFailure));
    });
  });

  describe("Check availability", () => {
    test("API is available", async () => {
      // act
      const result = await expoSecureStorage.isAvailable();
      // assert
      expect(expoSecureStorage.isAvailable).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    test("API is not available", async () => {
      // arrange
      isAvailableAsyncMock.mockImplementation(() => Promise.resolve(false));
      // act
      const result = await expoSecureStorage.isAvailable();
      // assert
      expect(expoSecureStorage.isAvailable).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });
  });
});
