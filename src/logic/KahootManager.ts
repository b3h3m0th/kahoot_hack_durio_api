const Kahoot = require("kahoot.js-updated");

export default class KahootManager {
  public static clients: Map<string, Array<any>> = new Map();

  public static async joinClient(
    pin: number,
    name: string,
    visitorId: string
  ): Promise<any> {
    const client = new Kahoot();

    // Create Bot disconnecting/quiz ending handling
    // client.on("Disconnect", (r) =>
    //   this.clients.get(visitorId).length > 0
    //     ? this.clients.set(
    //         visitorId,
    //         this.clients[visitorId].includes(client) &&
    //           this.clients[visitorId].splice(
    //             this.clients[visitorId].indexOf(client),
    //             1
    //           )
    //       )
    //     : this.clients.delete(visitorId)
    // );

    client.on("Disconnect", (reason) => {
      console.log("Disconnected: " + reason);
    });
    client.on("QuizEnd", () => {
      console.log("The quiz has ended.");
    });

    this.clients.has(visitorId)
      ? this.clients.set(visitorId, [...this.clients.get(visitorId), client])
      : this.clients.set(visitorId, [client]);

    const error = await client.join(pin, name).catch((err) => err);
    return error;
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
        for (let i = 0; i < amount; i++) {
          error = await this.joinClient(pin, `${name} ${i + 1}`, visitorId);
        }

        if (error) return reject(error);
        else return resolve(error);
      } catch (err) {
        console.log(err);
        return reject(err);
      }
    });
  }

  public static reject(visitorId: string) {
    const clients = this.clients.get(visitorId);
    clients.forEach((c: any, i: number) => c.leave());
    this.clients.delete(visitorId);
  }
}
