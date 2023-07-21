import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "./routes/userRoutes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

var corsOptions = {
  origin: "http://localhost:8000",
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
