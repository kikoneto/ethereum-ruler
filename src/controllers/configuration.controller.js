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

  static async updateConfiguration(req, res) {
    try {
      const { name } = req.params;
      const updateData = req.body;

      const updatedConfiguration =
        await configurationService.updateConfigurationByName(name, updateData);
      res.status(200).json(updatedConfiguration);
    } catch (error) {
      console.error("Error updating configuration:", error);
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteConfiguration(req, res) {
    try {
      const { name } = req.params;

      const result = await configurationService.deleteConfigurationByName(name);

      res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting configuration:", error);
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteAllConfigurations(req, res) {
    try {
      const result = await configurationService.deleteAllConfigurations();

      res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting all configurations:", error);
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getConfigurationList(req, res) {
    try {
      const result = await configurationService.getAllConfigurations();

      res.status(200).json(result);
    } catch (error) {
      console.error("Error getting configuration list:", error);
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getConfigurationByName(req, res) {
    try {
      const { name } = req.body;

      const result = await configurationService.getConfigurationByName(name);

      res.status(200).json(result);
    } catch (error) {
      console.error("Error getting configuration by name:", error);
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getLatestConfiguration(req, res) {
    try {
      const result = await configurationService.getLatestConfiguration();

      res.status(200).json(result);
    } catch (error) {
      console.error("Error getting latest configuration", error);
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
