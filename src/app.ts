import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/config';
import { swaggerSpec } from './config/swagger';
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
    this.initializeSwagger();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use((req, _res, next) => {
      logger.info(`${req.method} ${req.path}`);
      next();
    });
  }

  private initializeSwagger(): void {
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Assessment API Documentation',
    }));
  }

  private initializeRoutes(): void {
    /**
     * @swagger
     * /health:
     *   get:
     *     summary: Health check endpoint
     *     tags: [System]
     *     responses:
     *       200:
     *         description: API is running
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: API is running
     *                 timestamp:
     *                   type: string
     *                   format: date-time
     */
    this.app.get('/health', (_req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
      });
    });

    /**
     * @swagger
     * tags:
     *   - name: Assessments
     *     description: Assessment management endpoints
     *   - name: System
     *     description: System health and monitoring endpoints
     */
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
      logger.info(`API Documentation: http://localhost:${config.port}/api-docs`);
    });
  }
}