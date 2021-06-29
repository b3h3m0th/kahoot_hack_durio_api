import { sleep } from "../util/time";

const Kahoot = require("kahoot.js-updated");

export default class KahootManager {
  public static clients: Array<any> = [];
  public static async joinClient(pin: number, name: string): Promise<any> {
    const client = new Kahoot();
    await client.join(pin, name).catch((err) => err && "");
    client.on("Joined", () => (client.joined = true));
    this.clients.push(client);
  }
  public static async flood(
    pin: number,
    amount: number,
    name: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        [...new Array(amount)].forEach(async (_, i: number) => {
          await this.joinClient(pin, `${name} ${i + 1}`);
          sleep(1000);
        });

        resolve();
      } catch (err) {
        console.log(err);
        return reject();
      }
    });
  }
}
