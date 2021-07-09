import KahootManager from "./KahootManager";

// Very unelegant solution.
// Needed tho since not implemented properly in the deprecated package and for safety reasons
export default class TrashCan {
  public static async collect(
    visitorId: string,
    client: any
  ): Promise<NodeJS.Timeout> {
    const timeout: number = 1000 * 10;
    try {
      return setTimeout(() => this.removeClient(visitorId, client), timeout);
    } catch (err) {
      console.log(err);
    }
  }

  public static removeClient(visitorId: string, client: any): void {
    KahootManager.clients.get(visitorId).length > 0
      ? KahootManager.clients.set(
          visitorId,
          KahootManager.clients
            .get(visitorId)
            .filter((c) => c.token !== client.token)
        )
      : KahootManager.clients.delete(visitorId);
    console.log(KahootManager.clients);
  }
}
