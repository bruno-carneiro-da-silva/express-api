import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import https from "https";
import fs from "fs";
import http from "http";
import adminRoutes from "./routes/admin";
import loginRoutes from "./routes/site";
import { requestInterceptor } from "./utils/requestInterceptor";

const app = express();

app.set("trust proxy", 1);

const allowedOrigin = [
  "https://inventorygenius.vercel.app",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin || allowedOrigin.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

const limiter = rateLimit({
  windowMs: 10000,
  max: 10,
  message:
    "Muitas requisições feitas pelo usuário, tente novamente mais tarde.",
});

app.use(limiter);

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
