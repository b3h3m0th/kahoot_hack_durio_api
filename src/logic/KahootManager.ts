import { sleep } from "../util/time";

const Kahoot = require("kahoot.js-updated");

export default class KahootManager {
  public static async joinClient(pin: number, name: string): Promise<any> {
    const client = new Kahoot();
    const error = await client.join(pin, name).catch((err) => err);
    console.log("err", error);
    return error;
  }
  public static async flood(
    pin: number,
    amount: number,
    name: string,
    callback: (error: any) => any
  ): Promise<any> {
    try {
      let error;
      for (let i = 0; i < amount; i++) {
        error = await this.joinClient(pin, `${name} ${i + 1}`);
      }

      console.log(error);
      return callback(error);
    } catch (err) {
      console.log(err);
      return callback(err);
    }
  }
}
