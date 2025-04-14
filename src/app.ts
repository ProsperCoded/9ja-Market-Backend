import express from "express";
import cors from "cors";
import helmet from "helmet";
import { databaseService } from "./utils/database";
import { HomeController } from "./home/home.controller";
import { AppEnum } from "./constants/app.enum";
import errorHandler from "./utils/middlewares/error-handler.middleware";
import "reflect-metadata";
import "./auth/passport.config";
import swaggerUi from 'swagger-ui-express';
import { specs } from './utils/swagger/swagger.config';

// Import Index Router
import IndexRouter from "./routes";
import passport from "passport";

// Create App
const app: express.Express = express();

// Connect to Database
databaseService.connect();
// Configure App
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.set("port", process.env.PORT || AppEnum.PORT);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "x-api-key",
    ],
  })
);
app.use(helmet());
app.use(passport.initialize());

// Use Index Router
app.use(AppEnum.PREFIX, IndexRouter);

// Not Found Handler
const home = new HomeController();
app.use(home.notFound);

// Error Handler
app.use(errorHandler);

// Export App
export default app;
