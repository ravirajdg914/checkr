import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Candidate from "./candidateModel";

class Report extends Model {
  public id!: number;
  public status!: "clear" | "consider";
  public package!: string;
  public adjudication!: string;
  public turnaround_time!: number;
  public completed_at!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public candidateId!: number;
}

Report.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM("clear", "consider"),
      allowNull: false,
    },
    package: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adjudication: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    turnaround_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    candidateId: {
      type: DataTypes.INTEGER,
      references: {
        model: Candidate,
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "reports",
    modelName: "Report",
    timestamps: true,
  }
);

Report.belongsTo(Candidate, { foreignKey: "candidateId" });

export default Report;
