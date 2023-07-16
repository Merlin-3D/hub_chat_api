import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes';
import cors from 'cors'
import bodyParser from 'body-parser'

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

var corsOptions = {
  origin: "http://localhost:8000"
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use("/api", authRouter);


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});