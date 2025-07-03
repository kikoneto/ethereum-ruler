import express from "express";
import { sequelize } from "./database.js";
import { ConfigurationController } from "./controllers/configuration.controller.js";

sequelize.sync().then(() => console.log("dev-sqlite is ready"));

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.post("/configurations", ConfigurationController.createConfiguration);

app.listen(3000, () => {
  console.log("app is running");
});
