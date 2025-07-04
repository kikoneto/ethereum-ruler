import logger from "../logger/logger.js";
import { Configuration } from "../models/index.js";

export class ConfigurationService {
  // Mutate Methods

  async createConfiguration({
    name,
    minValueEth,
    maxValueEth,
    from,
    to,
    transactionType,
    recoveryId,
    blockNumber,
    delayed_blocks = 0,
  }) {
    if (!name) {
      throw new Error("'name' is a required field.");
    }

    try {
      const configuration = await Configuration.create({
        name,
        minValueEth,
        maxValueEth,
        from,
        to,
        transactionType,
        recoveryId,
        blockNumber,
        delayed_blocks,
      });
      logger.create(`Configuration created: ${name}`);
      return configuration;
    } catch (error) {
      logger.error(`Failed to create configuration ${name}: ${error.message}`);
      throw error;
    }
  }

  async updateConfigurationByName(name, updateData) {
    try {
      const configuration = await Configuration.findOne({ where: { name } });

      if (!configuration) {
        const msg = `Configuration with name "${name}" not found.`;
        throw new Error(msg);
      }

      await configuration.update(updateData);
      logger.update(`Configuration updated: ${name}`);
      return configuration;
    } catch (error) {
      logger.error(`Failed to update configuration ${name}: ${error.message}`);
      throw error;
    }
  }

  async deleteConfigurationByName(name) {
    try {
      const configuration = await Configuration.findOne({ where: { name } });

      if (!configuration) {
        const msg = `Configuration with name "${name}" not found.`;
        logger.warn(`deleteConfigurationByName: ${msg}`);
        throw new Error(msg);
      }

      await configuration.destroy();
      logger.warn(`Configuration deleted: ${name}`);
      return { message: `Configuration with name "${name}" deleted.` };
    } catch (error) {
      logger.error(`Failed to delete configuration ${name}: ${error.message}`);
      throw error;
    }
  }

  async deleteAllConfigurations() {
    try {
      const deletedCount = await Configuration.destroy({ where: {} });
      logger.warn(
        `Deleted all configurations: ${deletedCount} entries removed with all related transactions.`
      );
      return {
        message: `${deletedCount} configurations(s) deleted with all related transactions.`,
      };
    } catch (error) {
      logger.error(`Failed to delete all configurations: ${error.message}`);
      throw error;
    }
  }

  // Get Methods
  async getAllConfigurations() {
    logger.info("Fetching all configurations");
    return await Configuration.findAll();
  }

  async getConfigurationByName(name) {
    logger.info(`Fetching configuration by name: ${name}`);

    const configuration = await Configuration.findOne({ where: { name } });

    if (!configuration) {
      const msg = `Configuration with name "${name}" not found.`;
      logger.warn(msg);
      throw new Error(msg);
    }

    return configuration;
  }

  async getLatestConfiguration() {
    logger.info("Fetching latest configuration");

    const latestConfig = await Configuration.findOne({
      order: [["updatedAt", "DESC"]],
    });

    if (!latestConfig) {
      const msg = "No configurations found.";
      logger.warn(msg);
      throw new Error(msg);
    }

    return latestConfig;
  }

  // Filter Methods
  matchesConfig(tx, config, currentBlockNumber) {
    // Block delay logic
    if (
      config.blockNumber &&
      currentBlockNumber < config.blockNumber + config.delayed_blocks
    ) {
      logger.info(
        `Transaction skipped due to block delay for config: ${config.name}`
      );
      return false;
    }

    // Address checks
    if (config.from && config.from.toLowerCase() !== tx.sender.toLowerCase()) {
      return false;
    }

    if (config.to && config.to.toLowerCase() !== tx.receiver.toLowerCase()) {
      return false;
    }

    // Min/Max value check
    const txValue = parseFloat(tx.valueEth);

    if (
      config.minValueEth !== undefined &&
      config.minValueEth !== null &&
      txValue < config.minValueEth
    ) {
      return false;
    }

    if (
      config.maxValueEth !== undefined &&
      config.maxValueEth !== null &&
      txValue > config.maxValueEth
    ) {
      return false;
    }

    // Transaction type check (if specified)
    if (
      config.transactionType !== null &&
      config.transactionType !== undefined &&
      tx.transactionType !== config.transactionType
    ) {
      return false;
    }

    // Recovery ID check (if specified)
    if (
      config.recoveryId !== null &&
      config.recoveryId !== undefined &&
      tx.recoveryId !== config.recoveryId
    ) {
      return false;
    }

    // Passed all filters
    return true;
  }
}
