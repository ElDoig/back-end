import Sequelize from "sequelize";
import pg from "pg";

const hostname =
  process.env.DB_HOST || "prograweb-db.postgres.database.azure.com";
const username = process.env.DB_USERNAME || "postgres";
const password = process.env.DB_PASSWORD || "Administrador!";
const database = process.env.DB_NAME || "tiendadb";
const port = process.env.DB_PORT || 5432;
const dialect = "postgres";

const sequelize = new Sequelize(database, username, password, {
  host: hostname,
  port: port,
  dialect: dialect,
  dialectModule: pg,
});

export default sequelize;
