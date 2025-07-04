import { sequelize } from "../database.js";
import { Configuration } from "./configuration.model.js";
import { Transaction } from "./transaction.model.js";

// Prepare models object
const models = {
  Configuration,
  Transaction,
};

// Run associations
Object.values(models).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});

export { sequelize };
export * from "./configuration.model.js";
export * from "./transaction.model.js";
