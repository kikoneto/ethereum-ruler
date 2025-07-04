// routes/index.js
import { ConfigurationController } from "./controllers/configuration.controller.js";
import { TransactionController } from "./controllers/transaction.controller.js";

export function registerRoutes(app) {
  // Configuration routes
  app.get("/configurations", ConfigurationController.getConfigurationList);
  app.get(
    "/configuration/latest",
    ConfigurationController.getLatestConfiguration
  );
  app.get(
    "/configurations/:name",
    ConfigurationController.getConfigurationByName
  );
  app.post("/configuration", ConfigurationController.createConfiguration);
  app.put("/configuration/:name", ConfigurationController.updateConfiguration);
  app.delete(
    "/configuration/:name",
    ConfigurationController.deleteConfiguration
  );
  app.delete(
    "/configurations/clear",
    ConfigurationController.deleteAllConfigurations
  );

  // Transaction routes
  app.get("/transactions", TransactionController.getTransactionList);
  app.get(
    "/transactions/:name",
    TransactionController.getTransactionsByConfigName
  );
  app.post("/transaction", TransactionController.createTransaction);
  app.put("/transaction/:hash", TransactionController.updateTransaction);
  app.delete("/transaction/:hash", TransactionController.deleteTransaction);
  app.delete(
    "/transactions/clear",
    TransactionController.deleteAllTransactions
  );
}
