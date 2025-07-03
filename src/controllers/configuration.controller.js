import { ConfigurationService } from "../services/configuration.service.js";

const configurationService = new ConfigurationService();

export class ConfigurationController {
  static async createConfiguration(req, res) {
    try {
      const configuration = await configurationService.createConfiguration(
        req.body
      );
      res.status(201).json(configuration);
    } catch (error) {
      console.error("Error creating configuration:", error);

      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
