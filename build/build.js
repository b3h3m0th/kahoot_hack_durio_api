define("logic/KahootManager", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Kahoot = require("kahoot.js-updated");
    class KahootManager {
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
    exports.default = KahootManager;
});
define("index", ["require", "exports", "dotenv", "express", "cors", "morgan", "logic/KahootManager"], function (require, exports, dotenv, express, cors, morgan, KahootManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    dotenv.config();
    const app = express();
    const PORT = 1234;
    app.use(express.json());
    app.use(cors("*"));
    app.use(morgan("dev"));
    app.get("/", (req, res) => {
        return res.send(`Welcome to Kahoot Hack Durio Backend ;D`);
    });
    app.post("/flood", async (req, res) => {
        try {
            const { pin, amount, name } = req.body;
            if (!pin || !amount || name === undefined)
                return res.sendStatus(501);
            await KahootManager_1.default.flood(pin, amount, name);
            return res.sendStatus(200);
        }
        catch (err) {
            return res.sendStatus(501);
        }
    });
    app.listen(PORT, () => console.log(`Kahoot Hack Durio API live on ${PORT}`));
});
define("util/time", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sleep = void 0;
    const sleep = (time) => new Promise((resolve, reject) => setTimeout(resolve, time));
    exports.sleep = sleep;
});
