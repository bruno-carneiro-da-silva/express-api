import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
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

app.use(helmet());

app.all("*", requestInterceptor);
app.use("/admin", adminRoutes);
app.use("/", loginRoutes);

const runServer = (port: number, server: http.Server) => {
  server.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
};

const serverPort: number = process.env.PORT ? parseInt(process.env.PORT) : 9000;

if (process.env.NODE_ENV === "production") {
  const sslKeyPath = process.env.SSL_KEY_PATH;
  const sslCertPath = process.env.SSL_CERT_PATH;

  if (!sslKeyPath || !sslCertPath) {
    console.error(
      "SSL key and certificate paths must be defined in production."
    );
    process.exit(1);
  }

  const httpsOptions = {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCertPath),
  };
  const secureServer = https.createServer(httpsOptions, app);
  runServer(serverPort, secureServer);
} else {
  const regularServer = http.createServer(app);
  runServer(serverPort, regularServer);
}
