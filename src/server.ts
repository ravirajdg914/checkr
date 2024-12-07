import app from "./app";
import sequelize from "./config/database";
import { MESSAGES } from "./utils/constants";

const PORT = process.env.PORT ?? 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log(MESSAGES.SUCCESS.DATABASE_CONNECTED);
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(MESSAGES.SUCCESS.SERVER_RUNNING(PORT));
    });
  } catch (error) {
    console.error(MESSAGES.ERROR.DATABASE_CONNECTION_FAILED, error);
  }
})();
