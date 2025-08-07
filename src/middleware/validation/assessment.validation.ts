import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  next();
};

export const validateAssessment = {
  create: [
    body('_id')
      .not().exists().withMessage('_id should not be provided, it will be generated automatically'),
    body('title')
      .notEmpty().withMessage('Title is required')
      .isLength({ max: 200 }).withMessage('Title must not exceed 200 characters'),
    body('description')
      .notEmpty().withMessage('Description is required')
      .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),
    body('type')
      .notEmpty().withMessage('Type is required')
      .isIn(['quiz', 'exam', 'survey', 'assignment']).withMessage('Invalid assessment type'),
    body('questions')
      .isArray({ min: 1 }).withMessage('Questions must be an array with at least one question'),
    body('questions.*.id')
      .notEmpty().withMessage('Question ID is required'),
    body('questions.*.text')
      .notEmpty().withMessage('Question text is required'),
    body('questions.*.type')
      .isIn(['multiple-choice', 'true-false', 'short-answer', 'essay'])
      .withMessage('Invalid question type'),
    body('questions.*.points')
      .isFloat({ min: 0 }).withMessage('Points must be a non-negative number'),
    body('duration')
      .optional()
      .isInt({ min: 0 }).withMessage('Duration must be a non-negative integer'),
    body('passingScore')
      .optional()
      .isFloat({ min: 0 }).withMessage('Passing score must be a non-negative number'),
    handleValidationErrors,
  ],

  update: [
    param('id')
      .isMongoId().withMessage('Invalid assessment ID'),
    body('_id')
      .not().exists().withMessage('_id cannot be updated'),
    body('title')
      .optional()
      .isLength({ max: 200 }).withMessage('Title must not exceed 200 characters'),
    body('description')
      .optional()
      .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),
    body('type')
      .optional()
      .isIn(['quiz', 'exam', 'survey', 'assignment']).withMessage('Invalid assessment type'),
    body('questions')
      .optional()
      .isArray({ min: 1 }).withMessage('Questions must be an array with at least one question'),
    handleValidationErrors,
  ],

  getById: [
    param('id')
      .isMongoId().withMessage('Invalid assessment ID'),
    handleValidationErrors,
  ],

  delete: [
    param('id')
      .isMongoId().withMessage('Invalid assessment ID'),
    handleValidationErrors,
  ],

  toggleStatus: [
    param('id')
      .isMongoId().withMessage('Invalid assessment ID'),
    handleValidationErrors,
  ],

  getAll: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'updatedAt', 'title', 'type']).withMessage('Invalid sort field'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
    query('isActive')
      .optional()
      .isBoolean().withMessage('isActive must be a boolean'),
    handleValidationErrors,
  ],

  getByType: [
    param('type')
      .isIn(['quiz', 'exam', 'survey', 'assignment']).withMessage('Invalid assessment type'),
    handleValidationErrors,
  ],

  getByCategory: [
    param('category')
      .notEmpty().withMessage('Category is required'),
    handleValidationErrors,
  ],
};