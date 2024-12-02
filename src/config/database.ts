import { Sequelize } from "sequelize";

const sequelize = new Sequelize("checkr", "root", "Illusion@914", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

export default sequelize;
