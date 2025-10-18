import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { correlationMiddleware } from './middlewares/correlation';
import { env } from './config/env';
import { apiRouter } from './routes';
import { errorHandler } from './middlewares/error-handler';

export function createApp() {
  const app = express();

  const corsOptions = env.CORS_ORIGIN
    ? { origin: env.CORS_ORIGIN, credentials: true }
    : { origin: '*', credentials: false };
  app.use(cors(corsOptions));

  app.use(correlationMiddleware);
  app.use(
    pinoHttp({
      customLogLevel: (_res, err) => (err ? 'error' : 'info'),
      genReqId: (req, _res) => (req as any).id,
      redact: {
        paths: ['req.headers.authorization', 'req.headers.cookie'],
        censor: '[REDACTED]'
      }
    })
  );

  app.use(express.json());

  app.use('/api/v1', apiRouter);

  app.use(errorHandler);
  return app;
}