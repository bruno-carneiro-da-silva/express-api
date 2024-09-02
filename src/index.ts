import "dotenv/config";
import express from "express";
import cors from "cors";
import https from "https";
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

const regularServer = http.createServer(app);
const serverPort: number = process.env.PORT ? parseInt(process.env.PORT) : 9000;

if (process.env.NODE_ENV === "production") {
  const server = https.createServer(
    {
      key: process.env.SSL_KEY,
      cert: process.env.SSL_CERT,
    },
    app
  );
  runServer(serverPort, server);
} else {
  runServer(serverPort, regularServer);
}
