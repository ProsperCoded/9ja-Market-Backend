import express from "express";
import cors from "cors";
import helmet from "helmet";
import { databaseService } from "./utils/database";
import { HomeController } from "./home/home.controller";
import { AppEnum } from "./constants/app.enum";
import errorHandler from "./utils/middlewares/error-handler.middleware";
import "reflect-metadata";
import "./auth/passport.config";

// Import Index Router
import IndexRouter from "./routes";
import passport from "passport";
import { eventEmmiter } from "./utils/events";
import { EmailService } from "./utils/email/email.service";
import { EmailPaths, EmailSubjects } from "./constants/email.enum";

// Testing
const emailService = new EmailService();
emailService
  .sendMail({
    to: "enweremproper@gmail.com",
    subject: EmailSubjects.PASSWORD_RESET_MERCHANT,
    options: {
      template: EmailPaths.PASSWORD_RESET,
      data: { resetCode: 2020220 },
    },
  })
  .then((result) => {
    console.log("Email sent successfully:", result);
  })
  .catch((error) => {
    console.error("Error sending email:", error);
  });
// Create App
const app: express.Express = express();

// Connect to Database
databaseService.connect();

// Configure App
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
