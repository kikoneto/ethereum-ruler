import { Configuration } from "../models/index.js";

export class ConfigurationService {
  async createConfiguration({ name, criteria_json, delayed_blocks }) {
    if (!name || !criteria_json) {
      const error = new Error(
        "'name' and 'criteria_json' are required fields."
      );
      throw error;
    }

    const configuration = await Configuration.create({
      name,
      criteria_json,
      delayed_blocks,
    });

    return configuration;
  }
}
