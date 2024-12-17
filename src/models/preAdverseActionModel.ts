import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Candidate from "./candidateModel";

class PreAdverseAction extends Model {
  public id!: number;
  public candidateId!: number;
  public charges!: { charge: string; status: boolean }[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PreAdverseAction.init(
  {
    candidateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Candidate,
        key: "id",
      },
    },
    charges: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "pre_adverse_actions",
    modelName: "PreAdverseAction",
    timestamps: true,
  }
);

export default PreAdverseAction;
