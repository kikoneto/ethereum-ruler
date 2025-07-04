import { TransactionService } from "../services/transaction.service.js";

const transactionService = new TransactionService();

export class TransactionController {
  static async createTransaction(req, res) {
    try {
      const transaction = await transactionService.createTransaction(req.body);
      res.status(201).json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);

      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateTransaction(req, res) {
    try {
      const { hash } = req.params;
      const updateData = req.body;

      const updatedTransaction =
        await transactionService.updateTransactionByHash(hash, updateData);
      res.status(200).json(updatedTransaction);
    } catch (error) {
      console.error("Error updating transaction:", error);
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteTransaction(req, res) {
    try {
      const { hash } = req.params;

      const result = await transactionService.deleteTransactionByHash(hash);

      res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteAllTransactions(req, res) {
    try {
      const result = await transactionService.deleteAllTransactions();

      res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting all transactions:", error);
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getTransactionList(req, res) {
    try {
      const result = await transactionService.getAllTransactions();

      res.status(200).json(result);
    } catch (error) {
      console.error("Error getting transaction list:", error);
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getTransactionsByConfigName(req, res) {
    try {
      const { name } = req.params;

      const result =
        await transactionService.getTransactionsByConfigurationName(name);

      res.status(200).json(result);
    } catch (error) {
      console.error("Error getting transaction by config name:", error);
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
