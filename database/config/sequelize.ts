import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize({
  host: "127.0.0.1",
  port: 5432,
  database: process.env.DATA_BASE as string,
  username: process.env.USER_NAME as string,
  password: process.env.PASSWORD as string,
  dialect: "postgres", 
});

export default sequelize;