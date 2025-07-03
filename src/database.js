import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("database", "username", "password", {
  host: "./dev.sqlite",
  dialect: "sqlite",
});
