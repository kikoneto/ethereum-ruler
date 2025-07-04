import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export class Configuration extends Model {}

// Most filters are nullable since they are optional.
// Logic is if they are nullable they are not applied.

Configuration.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    minValueEth: {
      type: DataTypes.FLOAT, // Value in ETH (optional)
      allowNull: true,
    },
    maxValueEth: {
      type: DataTypes.FLOAT, // Value in ETH (optional)
      allowNull: true,
    },
    transactionType: {
      type: DataTypes.INTEGER, // Type of transaction (optional)
      allowNull: true,
    },
    recoveryId: {
      type: DataTypes.INTEGER, // Recovery ID (optional)
      allowNull: true,
    },
    from: {
      type: DataTypes.STRING, // Sender ethereum address (optional)
      allowNull: true,
    },
    to: {
      type: DataTypes.STRING, // Receiver ethereum address (optional)
      allowNull: true,
    },
    blockNumber: {
      type: DataTypes.INTEGER, // Specific block to watch (optional)
      allowNull: true,
    },
    delayed_blocks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Default to no delay if not specified
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    sequelize,
    modelName: "configuration",
    timestamps: true,
  }
);

// Add association method
Configuration.associate = (models) => {
  Configuration.hasMany(models.Transaction, {
    foreignKey: "configurationId",
    as: "transactions",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};
