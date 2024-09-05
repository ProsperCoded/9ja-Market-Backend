import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Import Index Router


// Create App
const app: express.Express = express();

// Connect to Database

// Configure App
app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());


// Use Index Router


// Error Handler

// Export App
export default app;
