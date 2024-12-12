import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Candidate from "./candidateModel";

class CourtSearch extends Model {
  public id!: number;
  public status!: "clear" | "consider";
  public search_type!: string;
  public date!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public candidateId!: number;
}

CourtSearch.init(
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
    search_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
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
    tableName: "court_searches",
    modelName: "CourtSearch",
    timestamps: true,
  }
);

CourtSearch.belongsTo(Candidate, { 
    foreignKey: "candidateId",
    onDelete: 'CASCADE'
});

export default CourtSearch; 