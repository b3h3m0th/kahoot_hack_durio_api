import TrashCan from "./TrashCan";

const Kahoot = require("kahoot.js-updated");

export default class KahootManager {
  public static clients: Map<string, Array<any>> = new Map();

  public static async joinClient(
    pin: number,
    name: string,
    visitorId: string
  ): Promise<any> {
    const client = new Kahoot();
    await TrashCan.autoCollect(visitorId, client);

    client.on(
      "Disconnect",
      async (r: any) => await this.removeClient(visitorId, client)
    );
    client.on(
      "QuizEnd",
      async (r: any) => await this.removeClient(visitorId, client)
    );

    this.clients.has(visitorId)
      ? this.clients.set(visitorId, [...this.clients.get(visitorId), client])
      : this.clients.set(visitorId, [client]);

    const error = await client.join(pin, name).catch((err) => err);

    return error;
  }

  public static removeClient(visitorId: string, client: any): void {
    try {
      client.leave();
      const clients = this.clients.get(visitorId);
      clients && clients.length > 1
        ? this.clients.set(
            visitorId,
            clients.filter((c) => c.token !== client.token)
          )
        : this.clients.delete(visitorId);
    } catch (err) {
      console.log(err);
    }
  }

  public static flood(
    pin: number,
    amount: number,
    name: string,
    visitorId: string
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let error;
        for (let i = 0; i < amount; i++)
          error = await this.joinClient(pin, `${name} ${i + 1}`, visitorId);

        if (error) return reject(error);
        else return resolve(error);
      } catch (err) {
        console.log(err);
        return reject(err);
      }
    });
  }

  public static reject(visitorId: string): void {
    try {
      const clients = this.clients.get(visitorId);
      clients && clients.forEach((c: any, i: number) => c.leave());
      this.clients.delete(visitorId);
    } catch (err) {
      console.log(err);
    }
  }
}
