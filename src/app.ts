import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { databaseService } from './utils/database';
import errorHandler from './utils/middlewares/error-handler.middleware';

// Import Index Router


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


// Error Handler
app.use(errorHandler); 

// Export App
export default app;
