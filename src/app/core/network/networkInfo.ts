import { getNetworkStateAsync } from "expo-network";

export abstract class NetworkInfo {
  abstract get isInternetReachable(): Promise<boolean>;
}

export class ExpoNetworkInfo extends NetworkInfo {
  get isInternetReachable(): Promise<boolean> {
    return getNetworkStateAsync().then((state) =>
      state.isInternetReachable ? state.isInternetReachable : false
    );
  }
}
