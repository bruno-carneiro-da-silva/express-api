import "dotenv/config";
import express from "express";
import cors from "cors";
import https from "https";
import fs from "fs";
import http from "http";
import adminRoutes from "./routes/admin";
import loginRoutes from "./routes/site";
import { requestInterceptor } from "./utils/requestInterceptor";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("*", requestInterceptor);
app.use("/admin", adminRoutes);
app.use("/", loginRoutes);

const runServer = (port: number, server: http.Server) => {
  server.listen(port, () => {
    console.log(`🚀 is running on http://localhost:${port}`);
  });
};

const serverPort: number = process.env.PORT ? parseInt(process.env.PORT) : 9000;
const regularServer = http.createServer(app);
runServer(serverPort, regularServer);
