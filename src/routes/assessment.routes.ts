import { Router } from 'express';
import { AssessmentController } from '../controllers/Assessment.controller';
import { validateAssessment } from '../middleware/validation/assessment.validation';
import { asyncHandler } from '../middleware/asyncHandler';
import { checkDatabaseConnection } from '../middleware/checkDatabase';

export class AssessmentRoutes {
  private router: Router;
  private assessmentController: AssessmentController;

  constructor() {
    this.router = Router();
    this.assessmentController = new AssessmentController();
    this.router.use(checkDatabaseConnection);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      validateAssessment.create,
      asyncHandler(this.assessmentController.createAssessment)
    );

    this.router.get(
      '/',
      validateAssessment.getAll,
      asyncHandler(this.assessmentController.getAssessments)
    );

    this.router.get(
      '/:id',
      validateAssessment.getById,
      asyncHandler(this.assessmentController.getAssessmentById)
    );

    this.router.put(
      '/:id',
      validateAssessment.update,
      asyncHandler(this.assessmentController.updateAssessment)
    );

    this.router.delete(
      '/:id',
      validateAssessment.delete,
      asyncHandler(this.assessmentController.deleteAssessment)
    );

    this.router.patch(
      '/:id/toggle-status',
      validateAssessment.toggleStatus,
      asyncHandler(this.assessmentController.toggleAssessmentStatus)
    );

    this.router.get(
      '/type/:type',
      validateAssessment.getByType,
      asyncHandler(this.assessmentController.getAssessmentsByType)
    );

    this.router.get(
      '/category/:category',
      validateAssessment.getByCategory,
      asyncHandler(this.assessmentController.getAssessmentsByCategory)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}