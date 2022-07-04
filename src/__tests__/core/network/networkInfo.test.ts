jest.mock("expo-network");
import {
  getNetworkStateAsync,
  NetworkStateType,
  NetworkState,
} from "expo-network";

import { ExpoNetworkInfo } from "../../../app/core/network/networkInfo";

describe("ExpoNetworkInfo", () => {
  const tNetworkState: NetworkState = {
    type: NetworkStateType.CELLULAR,
    isConnected: true,
    isInternetReachable: true,
  };

  const expoNetworkInfo = new ExpoNetworkInfo();

  const getNetworkStateAsyncMock = getNetworkStateAsync as jest.Mock;

  describe("is internet reachable", () => {
    test("should forward the call to", async () => {
      // arrange
      getNetworkStateAsyncMock.mockImplementation(() =>
        Promise.resolve(tNetworkState)
      );
      // act
      const result = await expoNetworkInfo.isInternetReachable;
      // assert
      expect(getNetworkStateAsync).toBeCalledTimes(1);
      expect(result).toEqual(true);
    });

    test("should return false when there is no network state", async () => {
      // arrange
      getNetworkStateAsyncMock.mockImplementation(() => Promise.resolve({}));
      // act
      const result = await expoNetworkInfo.isInternetReachable;
      // assert
      expect(getNetworkStateAsync).toBeCalledTimes(1);
      expect(result).toEqual(false);
    });
  });
});
