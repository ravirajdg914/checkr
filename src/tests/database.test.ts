import sequelize from "../config/database";

jest.mock("../config/database", () => ({
  authenticate: jest.fn(() => Promise.resolve()),
  sync: jest.fn(() => Promise.resolve()),
  close: jest.fn(() => Promise.resolve()),
}));

describe("Database Connection", () => {
  test("should connect to the database successfully", async () => {
    try {
      await sequelize.authenticate();
      expect(sequelize.authenticate).toHaveBeenCalled();
      expect(true).toBe(true);
    } catch (error) {
      console.error("Database connection error:", error);
      expect(true).toBe(false);
    }
  });

  test("should fail to connect if an error occurs", async () => {
    jest.spyOn(sequelize, "authenticate").mockImplementationOnce(() => {
      throw new Error("Connection error");
    });

    try {
      await sequelize.authenticate();
    } catch (error: any) {
      expect(error.message).toBe("Connection error");
    }
  });

  test("should close the connection successfully", async () => {
    try {
      await sequelize.close();
      expect(sequelize.close).toHaveBeenCalled();
      expect(true).toBe(true);
    } catch (error) {
      console.error("Failed to close the database connection:", error);
      expect(true).toBe(false);
    }
  });
});
