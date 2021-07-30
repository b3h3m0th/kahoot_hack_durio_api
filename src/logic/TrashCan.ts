import KahootManager from "./KahootManager";

// Very unelegant solution.
// Needed tho since not implemented properly in the deprecated package and for safety reasons
import config from "../config";
export default class TrashCan {
  private static _collectingTimeout: number = config.autoCollectingTimeout;

  public static async autoCollect(
    visitorId: string,
    client: any
  ): Promise<NodeJS.Timeout> {
    try {
      return setTimeout(
        () => KahootManager.removeClient(visitorId, client),
        this._collectingTimeout
      );
    } catch (err) {
      console.log(err);
    }
  }
}
