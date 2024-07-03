import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import uploadRoutes from "./routes/uploadRoutes";
import filesRoutes from "./routes/filesRoutes";
import deleteRoutes from "./routes/deleteRoutes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = ["http://localhost:3000"];
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use("/upload", uploadRoutes);
app.use("/files", filesRoutes);
app.use("/files", deleteRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  console.log("SIGINT received: shutting down server...");
  server.close(() => {
    console.log("Server has been gracefully terminated");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received: shutting down server...");
  server.close(() => {
    console.log("Server has been gracefully terminated");
    process.exit(0);
  });
});
