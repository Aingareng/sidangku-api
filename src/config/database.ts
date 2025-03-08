import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const dbHost = process.env.DB_HOST || "localhost";
const dbUser = process.env.DB_USER || "root";
const dbPass = process.env.DB_PASS || "";
const dbName = process.env.DB_NAME || "test";
const dbPort = Number(process.env.DB_PORT) || 3306;
const dbDialect =
  (process.env.DB_DIALECT as "mysql" | "mariadb" | "postgres" | "mssql") ||
  "mysql";

export const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: dbDialect,
});
