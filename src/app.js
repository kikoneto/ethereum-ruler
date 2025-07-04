// app.js
import express from "express";
import dotenv from "dotenv";
import { Web3 } from "web3";
import logger from "./logger/logger.js";
import { sequelize } from "./database.js";
import { registerRoutes } from "./routes.js";

import { ConfigurationService } from "./services/configuration.service.js";
import { TransactionService } from "./services/transaction.service.js";

// Instantiate services
const configurationService = new ConfigurationService();
const transactionService = new TransactionService();

// Setup environment
dotenv.config();
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const PORT = process.env.PORT || 3000;

// Connect DB
sequelize.sync().then(() => logger.info("dev-sqlite is ready"));

// Express setup
const app = express();
app.use(express.json());

// Register API routes
registerRoutes(app);

// Subscription endpoints (For some reason breaks on export, so they are left here at this stage)
app.post("/subscription/start", async (req, res) => {
  try {
    await startBlockSubscription();
    res.json({ message: "Subscription started." });
  } catch (err) {
    logger.error("Failed to start subscription:", err);
    res.status(500).json({ error: "Failed to start subscription." });
  }
});

app.post("/subscription/stop", async (req, res) => {
  try {
    await stopBlockSubscription();
    res.json({ message: "Subscription stopped." });
  } catch (err) {
    logger.error("Failed to stop subscription:", err);
    res.status(500).json({ error: "Failed to stop subscription." });
  }
});

// Web3 subscription logic (kept here)
const web3 = new Web3(
  new Web3.providers.WebsocketProvider(
    `wss://mainnet.infura.io/ws/v3/${INFURA_PROJECT_ID}`
  )
);

let subscription = null;

async function startBlockSubscription() {
  if (subscription) {
    logger.warn("Subscription already running.");
    return;
  }

  subscription = await web3.eth.subscribe("newBlockHeaders");

  subscription.on("connected", (id) => logger.info("Subscription ID:", id));
  subscription.on("error", (err) => logger.error("Subscription error:", err));

  subscription.on("data", async (header) => {
    const blockNumber = header.number;
    logger.warn("New block received:", blockNumber);

    try {
      const block = await web3.eth.getBlock(blockNumber, true);
      const configs = await configurationService.getAllConfigurations();
      const transactions = block.transactions.slice(0, 10);

      if (!configs.length) {
        throw new Error(
          "No configurations found. Please create at least one configuration."
        );
      }

      if (!transactions.length) {
        throw new Error("No transactions found. Please check Web3 connection.");
      }

      const matchCounts = {};
      configs.forEach((config) => (matchCounts[config.name] = 0));

      for (const tx of transactions) {
        const mappedTx = transactionService.mapToITransaction(tx);

        for (const config of configs) {
          if (
            configurationService.matchesConfig(mappedTx, config, blockNumber)
          ) {
            mappedTx.configurationId = config.id;
            await transactionService.createTransaction(mappedTx);
            matchCounts[config.name]++;
          }
        }
      }

      logger.warn(`Transaction match counts for block ${blockNumber}:`);
      for (const [configName, count] of Object.entries(matchCounts)) {
        logger.warn(`${configName}: ${count} transaction(s)`);
      }
    } catch (err) {
      logger.error("Error handling block:", err.message);
    }
  });
}

async function stopBlockSubscription() {
  if (!subscription) {
    logger.warn("No active subscription to stop.");
    return;
  }

  await subscription.unsubscribe((error, success) => {
    if (success) {
      logger.info("Subscription stopped.");
      subscription = null;
    } else {
      logger.error("Failed to unsubscribe:", error);
    }
  });
}

// Start server
app.listen(PORT, () => {
  logger.info(`app is running on port: ${PORT}`);
});
