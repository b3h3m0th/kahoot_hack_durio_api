import * as dotenv from "dotenv";
dotenv.config();

import * as express from "express";
import * as cors from "cors";
import * as morgan from "morgan";
import { Request, Response } from "express";
import KahootManager from "./logic/KahootManager";
const app = express();

const PORT = process.env.PORT || 1234;

app.use(express.json());
app.use(cors("*"));
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  return res.send(`Welcome to Kahoot Hack Durio Backend ;D`);
});

app.post("/flood", async (req: Request, res: Response) => {
  try {
    const { pin, amount, name, visitorId } = req.body;
    if (!pin || !amount || name === undefined) return res.sendStatus(501);

    await KahootManager.flood(pin, amount, name, visitorId);
    console.log(KahootManager.clients);
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(501);
  }
});

app.post("/reject", async (req: Request, res: Response) => {
  try {
    const { visitorId } = req.body;
    if (!visitorId) return res.sendStatus(501);

    await KahootManager.reject(visitorId);
    console.log(KahootManager.clients);
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(501);
  }
});

app.listen(PORT, () => console.log(`Kahoot Hack Durio API live on ${PORT}`));
