import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { corsOptions } from './config/cors';
import { connectDB } from './config/db';
import { env } from './config/env';
import { helmetOptions } from './config/helmet';
import { httpLogger } from './config/logger';
import { apiLimiter } from './config/rateLimit';
import { errorHandler } from './middleware/errorHandler.middleware';
import routes from './routes/index';

const app = express();

app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(helmet(helmetOptions));
app.use(httpLogger);

app.use(express.json());
app.use(cookieParser());

connectDB();

app.get('/health', (_req, res) => res.status(200).send('ok'));

app.use('/api', apiLimiter);
app.use('/api', routes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server is running on port: ${env.port}`);
});
