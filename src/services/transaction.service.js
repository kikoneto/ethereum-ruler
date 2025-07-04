import logger from "../logger/logger.js";
import Web3 from "web3";
import { Transaction, Configuration } from "../models/index.js";

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const web3 = new Web3(
  new Web3.providers.WebsocketProvider(
    `wss://mainnet.infura.io/ws/v3/${INFURA_PROJECT_ID}`
  )
);

export class TransactionService {
  // Mutate Methods
  async createTransaction(tx) {
    if (!tx.hash) {
      logger.error("createTransaction failed: Missing transaction hash");
      throw new Error("Missing transaction hash");
    }
    if (!tx.configurationId) {
      logger.error("createTransaction failed: Missing configuration ID.");
      throw new Error("Missing configuration ID.");
    }

    try {
      const createdTx = await Transaction.create({
        hash: tx.hash,
        sender: tx.sender,
        receiver: tx.receiver,
        blockNumber: tx.blockNumber,
        input: tx.input || "0x",
        valueEth: tx.valueEth,
        recoveryId: Number(tx.recoveryId),
        transactionType: Number(tx.transactionType),
        configurationId: tx.configurationId,
      });

      logger.create(`Successfully added Transaction: ${createdTx.hash}`);
      return createdTx;
    } catch (error) {
      logger.error(`Failed to create transaction ${tx.hash}: ${error.message}`);
      return null;
    }
  }

  async updateTransactionByHash(hash, updateData) {
    try {
      const transaction = await Transaction.findOne({ where: { hash } });

      if (!transaction) {
        const msg = `Transaction with hash "${hash}" not found.`;
        logger.warn(`updateTransactionByHash: ${msg}`);
        throw new Error(msg);
      }

      await transaction.update(updateData);
      logger.update(`Transaction with hash "${hash}" updated.`);
      return transaction;
    } catch (error) {
      logger.error(`Failed to update transaction ${hash}: ${error.message}`);
      throw error;
    }
  }

  async deleteTransactionByHash(hash) {
    try {
      const transaction = await Transaction.findOne({ where: { hash } });

      if (!transaction) {
        const msg = `Transaction with hash "${hash}" not found.`;
        logger.warn(`deleteTransactionByHash: ${msg}`);
        throw new Error(msg);
      }

      await transaction.destroy();
      logger.delete(`Transaction with hash "${hash}" deleted.`);
      return { message: `Transaction with hash "${hash}" deleted.` };
    } catch (error) {
      logger.error(`Failed to delete transaction ${hash}: ${error.message}`);
      throw error;
    }
  }

  async deleteAllTransactions() {
    try {
      const deletedCount = await Transaction.destroy({ where: {} });
      logger.warn(`Deleted all transactions: ${deletedCount} entries removed.`);
      return { message: `${deletedCount} transaction(s) deleted.` };
    } catch (error) {
      logger.error(`Failed to delete all transactions: ${error.message}`);
      throw error;
    }
  }

  // Get Methods
  async getTransactionByHash(hash) {
    logger.info(`Fetching transaction by hash: ${hash}`);
    return await Transaction.findByPk(hash);
  }

  async getTransactionsByConfigurationName(name) {
    logger.info(`Fetching transactions by configuration name: ${name}`);
    return await Transaction.findAll({
      include: [
        {
          model: Configuration,
          as: "configuration",
          where: { name },
          attributes: ["id", "name"],
        },
      ],
    });
  }

  async getAllTransactions() {
    logger.info("Fetching all transactions");
    return await Transaction.findAll();
  }

  mapToITransaction(rawTx) {
    return {
      hash: rawTx.hash,
      sender: rawTx.from,
      receiver: rawTx.to,
      blockNumber: rawTx.blockNumber,
      input: rawTx.input || "",
      valueEth: web3.utils.fromWei(rawTx.value, "ether"),
      recoveryId: Number(rawTx.v),
      transactionType: Number(rawTx.type),
    };
  }
}
