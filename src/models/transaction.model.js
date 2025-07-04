import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { Configuration } from "./configuration.model.js";

export class Transaction extends Model {}

Transaction.init(
  {
    hash: {
      type: DataTypes.STRING(66),
      primaryKey: true,
      allowNull: false,
    },
    sender: {
      type: DataTypes.STRING(42),
      allowNull: false,
    },
    receiver: {
      type: DataTypes.STRING(42),
      allowNull: false,
    },
    blockNumber: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    input: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    valueEth: {
      type: DataTypes.DECIMAL(36, 18),
      allowNull: false,
    },
    recoveryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transactionType: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    configurationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Configuration,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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
    modelName: "transaction",
    timestamps: true,
  }
);

Transaction.associate = (models) => {
  Transaction.belongsTo(models.Configuration, {
    foreignKey: "configurationId",
    as: "configuration",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};
