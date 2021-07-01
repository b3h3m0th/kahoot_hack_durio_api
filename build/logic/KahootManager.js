const Kahoot = require("kahoot.js-updated");
export default class KahootManager {
    static async joinClient(pin, name) {
        const client = new Kahoot();
        const error = await client.join(pin, name).catch((err) => err);
        return error;
    }
    static flood(pin, amount, name) {
        return new Promise(async (resolve, reject) => {
            try {
                let error;
                for (let i = 0; i < amount; i++) {
                    error = await this.joinClient(pin, `${name} ${i + 1}`);
                }
                if (error)
                    return reject(error);
                else
                    return resolve(error);
            }
            catch (err) {
                console.log(err);
                return reject(err);
            }
        });
    }
}
