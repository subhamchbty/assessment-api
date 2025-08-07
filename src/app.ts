import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/config';
import { AssessmentRoutes } from './routes/assessment.routes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

export class App {
  private app: Application;
  private assessmentRoutes: AssessmentRoutes;

  constructor() {
    this.app = express();
    this.assessmentRoutes = new AssessmentRoutes();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use((req, _res, next) => {
      logger.info(`${req.method} ${req.path}`);
      next();
    });
  }

  private initializeRoutes(): void {
    this.app.get('/health', (_req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
      });
    });

    this.app.use(
      `${config.apiPrefix}/assessments`,
      this.assessmentRoutes.getRouter()
    );

    this.app.use('*', (_req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public getApp(): Application {
    return this.app;
  }

  public listen(): void {
    this.app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });
  }
}