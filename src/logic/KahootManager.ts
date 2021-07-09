import TrashCan from "./TrashCan";

import * as Kahoot from "kahoot.js-updated";

export enum OnEventAction {
  disconnect = "disconnect",
  reconnect = "reconnect",
  none = "none",
  answer = "answer",
}

export default class KahootManager {
  public static clients: Map<string, Array<any>> = new Map();
  public static events = {
    [OnEventAction.disconnect]: [
      "Disconnect",
      "GameReset",
      "QuizEnd",
      // "Podium",
      // "Feedback",
    ],
    [OnEventAction.answer]: ["QuestionStart"],
  } as const;

  public static async joinClient(
    pin: number,
    name: string,
    visitorId: string
  ): Promise<any> {
    const client = new Kahoot();
    await TrashCan.autoCollect(visitorId, client);

    this.events["disconnect"].forEach((e: string) =>
      client.on(e, async (r: any) => {
        await this.removeClient(visitorId, client);
        console.log(this.clients);
      })
    );

    this.clients.has(visitorId)
      ? this.clients.set(visitorId, [...this.clients.get(visitorId), client])
      : this.clients.set(visitorId, [client]);

    return await client.join(pin, name).catch((err) => err);
  }

  public static removeClient(visitorId: string, client: any): void {
    try {
      client.leave();
      const clients = this.clients.get(visitorId);
      clients && clients.length > 1
        ? this.clients.set(
            visitorId,
            clients.filter((c) => c.clientId !== client.clientId)
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
        let result;
        for (let i = 0; i < amount; i++)
          result = await this.joinClient(pin, `${name} ${i + 1}`, visitorId);

        if (result.errror) return reject(result);
        else return resolve(result);
      } catch (err) {
        return reject(err);
      }
    });
  }

  public static reject(visitorId: string): void {
    try {
      const clients = this.clients.get(visitorId);
      clients && clients.forEach((c: any) => c.leave());
      this.clients.delete(visitorId);
    } catch (err) {
      console.log(err);
    }
  }
}
