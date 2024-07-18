import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoutes from "./routes/uploadRoutes";
import filesRoutes from "./routes/filesRoutes";
import deleteRoutes from "./routes/deleteRoutes";

dotenv.config();
const app = express();

const allowedOrigins = ["http://localhost:3000"];
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/upload", uploadRoutes);
app.use("/files", filesRoutes);
app.use("/files", deleteRoutes);

export default app;
