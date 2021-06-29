import { sleep } from "../util/time";

const Kahoot = require("kahoot.js-updated");

export default class KahootManager {
  public static joinClient(pin: number, name: string): void {
    const client = new Kahoot();
    const error = client.join(pin, name).catch((err) => err);
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
      [...new Array(amount)].forEach((_, i: number) => {
        error = this.joinClient(pin, `${name} ${i + 1}`);
        sleep(1000);
      });

      console.log(error);
      return callback(error);
    } catch (err) {
      console.log(err);
      return callback(err);
    }
  }
}
