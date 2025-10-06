import express, { Request, Response, NextFunction, Application } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import logger from './config/logger';
import routes from './routes';
import {expressjwt} from "express-jwt";
import jsonwebtoken from "jsonwebtoken";

dotenv.config();

const port: number = Number(process.env.PORT) || 9000;

/**
 * Initialize the server with the necessary parameters
 */
const createServer = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use((_req: Request, _res: Response, next: NextFunction) => {
    logger.http(`[${_req.method}] ${_req.url} - IP: ${_req.ip}`);
    next();
  });

    app.get('/', (_req: Request, res: Response) => {
        res.status(200).send('OK');
    });

  app.use('/api/v1', routes);

  return app;
};

/**
 * Create the server once it has been initialized
 */
const app = createServer();

//check if it is the main entry point
//helps to stop conflicting ports issue when running tests
if(require.main === module) {
    app.listen(port, () => {
        logger.info(`Server is running at http://localhost:${port}`);
    });
}

export default app;
