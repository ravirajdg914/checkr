import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Report from './reportModel';

class Candidate extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public dob!: Date;
  public phone!: string;
  public zipcode!: string;
  public social_security!: string;
  public drivers_license!: string;
  public adjudication!: string;
  public status!: "clear" | "consider";
  public location!: string;
  public date!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Candidate.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipcode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    social_security: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    drivers_license: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adjudication: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("clear", "consider"),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "candidates",
    modelName: "Candidate",
    timestamps: true,
  }
);

Candidate.hasOne(Report, {
    foreignKey: "candidateId",
    onDelete: 'CASCADE'
});

export default Candidate;
