import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { databaseService } from './utils/database';
import { HomeController } from './home/home.controller';
import errorHandler from './utils/middlewares/error-handler.middleware';

// Import Index Router
import IndexRouter from './routes';

// Create App
const app: express.Express = express();

// Connect to Database
databaseService.connect();

// Configure App
app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());


// Use Index Router
app.use('/api/v1', IndexRouter);

// Not Found Handler
const home = new HomeController();
app.use(home.notFound);

// Error Handler
app.use(errorHandler);

// Export App
export default app;
