import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoutes";
import candidateRoutes from "./routes/candidateRoutes";

const app = express();
app.disable("x-powered-by");

app.use(express.json());

app.use("/api/v1/users", authRoutes);
app.use("/api/v1/candidates", candidateRoutes);

app.use(errorHandler);

export default app;
