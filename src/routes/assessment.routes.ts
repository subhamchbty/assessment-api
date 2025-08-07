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
    /**
     * @swagger
     * /assessments:
     *   post:
     *     summary: Create a new assessment
     *     tags: [Assessments]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Assessment'
     *     responses:
     *       201:
     *         description: Assessment created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SuccessResponse'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       500:
     *         $ref: '#/components/responses/InternalError'
     */
    this.router.post(
      '/',
      validateAssessment.create,
      asyncHandler(this.assessmentController.createAssessment)
    );

    /**
     * @swagger
     * /assessments:
     *   get:
     *     summary: Get all assessments with pagination and filters
     *     tags: [Assessments]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 1
     *         description: Page number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 100
     *           default: 10
     *         description: Items per page
     *       - in: query
     *         name: sortBy
     *         schema:
     *           type: string
     *           enum: [createdAt, updatedAt, title, type]
     *           default: createdAt
     *         description: Field to sort by
     *       - in: query
     *         name: sortOrder
     *         schema:
     *           type: string
     *           enum: [asc, desc]
     *           default: desc
     *         description: Sort order
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *         description: Search in title and description
     *       - in: query
     *         name: type
     *         schema:
     *           type: string
     *           enum: [quiz, exam, survey, assignment]
     *         description: Filter by assessment type
     *       - in: query
     *         name: category
     *         schema:
     *           type: string
     *         description: Filter by category
     *       - in: query
     *         name: isActive
     *         schema:
     *           type: boolean
     *         description: Filter by active status
     *     responses:
     *       200:
     *         description: List of assessments
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PaginatedResponse'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       500:
     *         $ref: '#/components/responses/InternalError'
     */
    this.router.get(
      '/',
      validateAssessment.getAll,
      asyncHandler(this.assessmentController.getAssessments)
    );

    /**
     * @swagger
     * /assessments/{id}:
     *   get:
     *     summary: Get assessment by ID
     *     tags: [Assessments]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Assessment ID
     *     responses:
     *       200:
     *         description: Assessment details
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SuccessResponse'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       500:
     *         $ref: '#/components/responses/InternalError'
     */
    this.router.get(
      '/:id',
      validateAssessment.getById,
      asyncHandler(this.assessmentController.getAssessmentById)
    );

    /**
     * @swagger
     * /assessments/{id}:
     *   put:
     *     summary: Update an assessment
     *     tags: [Assessments]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Assessment ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Assessment'
     *     responses:
     *       200:
     *         description: Assessment updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SuccessResponse'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       500:
     *         $ref: '#/components/responses/InternalError'
     */
    this.router.put(
      '/:id',
      validateAssessment.update,
      asyncHandler(this.assessmentController.updateAssessment)
    );

    /**
     * @swagger
     * /assessments/{id}:
     *   delete:
     *     summary: Delete an assessment
     *     tags: [Assessments]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Assessment ID
     *     responses:
     *       200:
     *         description: Assessment deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SuccessResponse'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       500:
     *         $ref: '#/components/responses/InternalError'
     */
    this.router.delete(
      '/:id',
      validateAssessment.delete,
      asyncHandler(this.assessmentController.deleteAssessment)
    );

    /**
     * @swagger
     * /assessments/{id}/toggle-status:
     *   patch:
     *     summary: Toggle assessment active status
     *     tags: [Assessments]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Assessment ID
     *     responses:
     *       200:
     *         description: Status toggled successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SuccessResponse'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       500:
     *         $ref: '#/components/responses/InternalError'
     */
    this.router.patch(
      '/:id/toggle-status',
      validateAssessment.toggleStatus,
      asyncHandler(this.assessmentController.toggleAssessmentStatus)
    );

    /**
     * @swagger
     * /assessments/type/{type}:
     *   get:
     *     summary: Get assessments by type
     *     tags: [Assessments]
     *     parameters:
     *       - in: path
     *         name: type
     *         required: true
     *         schema:
     *           type: string
     *           enum: [quiz, exam, survey, assignment]
     *         description: Assessment type
     *     responses:
     *       200:
     *         description: List of assessments
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SuccessResponse'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       500:
     *         $ref: '#/components/responses/InternalError'
     */
    this.router.get(
      '/type/:type',
      validateAssessment.getByType,
      asyncHandler(this.assessmentController.getAssessmentsByType)
    );

    /**
     * @swagger
     * /assessments/category/{category}:
     *   get:
     *     summary: Get assessments by category
     *     tags: [Assessments]
     *     parameters:
     *       - in: path
     *         name: category
     *         required: true
     *         schema:
     *           type: string
     *         description: Assessment category
     *     responses:
     *       200:
     *         description: List of assessments
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/SuccessResponse'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       500:
     *         $ref: '#/components/responses/InternalError'
     */
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