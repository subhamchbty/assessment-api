import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { AssessmentModel } from '../models/Assessment.model';
import { 
  IAssessmentDocument, 
  CreateAssessmentDto, 
  UpdateAssessmentDto,
  AssessmentQuery 
} from '../types/assessment.types';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';

export class AssessmentController {
  private assessmentModel: Model<IAssessmentDocument>;

  constructor() {
    this.assessmentModel = AssessmentModel.getModel();
  }

  public createAssessment = async (
    req: Request<{}, {}, CreateAssessmentDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const assessmentData = req.body;
      
      // Remove _id field if provided to let MongoDB generate it
      if ('_id' in assessmentData) {
        delete (assessmentData as any)._id;
      }
      
      const assessment = new this.assessmentModel(assessmentData);
      const savedAssessment = await assessment.save();
      
      logger.info(`Assessment created: ${savedAssessment._id}`);
      
      res.status(201).json({
        success: true,
        data: savedAssessment,
        message: 'Assessment created successfully',
      });
    } catch (error: any) {
      logger.error('Error creating assessment:', error);
      
      if (error.name === 'ValidationError') {
        const message = Object.values(error.errors).map((err: any) => err.message).join(', ');
        return next(new AppError(message, 400));
      }
      
      next(new AppError(error.message || 'Failed to create assessment', 500));
    }
  };

  public getAssessments = async (
    req: Request<{}, {}, {}, AssessmentQuery>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search,
        type,
        category,
        isActive,
      } = req.query;

      const query: any = {};
      
      if (search) {
        query.$text = { $search: search };
      }
      
      if (type) {
        query.type = type;
      }
      
      if (category) {
        query.category = category;
      }
      
      if (isActive !== undefined) {
        query.isActive = String(isActive) === 'true';
      }

      const totalCount = await this.assessmentModel.countDocuments(query);
      
      const assessments = await this.assessmentModel
        .find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .limit(limit)
        .skip((page - 1) * limit);

      res.status(200).json({
        success: true,
        data: assessments,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      });
    } catch (error) {
      logger.error('Error fetching assessments:', error);
      next(new AppError('Failed to fetch assessments', 500));
    }
  };

  public getAssessmentById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      
      const assessment = await this.assessmentModel.findById(id);
      
      if (!assessment) {
        return next(new AppError('Assessment not found', 404));
      }

      res.status(200).json({
        success: true,
        data: assessment,
      });
    } catch (error) {
      logger.error('Error fetching assessment:', error);
      next(new AppError('Failed to fetch assessment', 500));
    }
  };

  public updateAssessment = async (
    req: Request<{ id: string }, {}, UpdateAssessmentDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedAssessment = await this.assessmentModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedAssessment) {
        return next(new AppError('Assessment not found', 404));
      }

      logger.info(`Assessment updated: ${id}`);

      res.status(200).json({
        success: true,
        data: updatedAssessment,
        message: 'Assessment updated successfully',
      });
    } catch (error) {
      logger.error('Error updating assessment:', error);
      next(new AppError('Failed to update assessment', 500));
    }
  };

  public deleteAssessment = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const deletedAssessment = await this.assessmentModel.findByIdAndDelete(id);

      if (!deletedAssessment) {
        return next(new AppError('Assessment not found', 404));
      }

      logger.info(`Assessment deleted: ${id}`);

      res.status(200).json({
        success: true,
        message: 'Assessment deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting assessment:', error);
      next(new AppError('Failed to delete assessment', 500));
    }
  };

  public toggleAssessmentStatus = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const assessment = await this.assessmentModel.findById(id);
      
      if (!assessment) {
        return next(new AppError('Assessment not found', 404));
      }

      assessment.isActive = !assessment.isActive;
      await assessment.save();

      logger.info(`Assessment status toggled: ${id}`);

      res.status(200).json({
        success: true,
        data: assessment,
        message: `Assessment ${assessment.isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      logger.error('Error toggling assessment status:', error);
      next(new AppError('Failed to toggle assessment status', 500));
    }
  };

  public getAssessmentsByType = async (
    req: Request<{ type: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { type } = req.params;
      
      const assessments = await this.assessmentModel.find({ type, isActive: true });

      res.status(200).json({
        success: true,
        data: assessments,
        count: assessments.length,
      });
    } catch (error) {
      logger.error('Error fetching assessments by type:', error);
      next(new AppError('Failed to fetch assessments', 500));
    }
  };

  public getAssessmentsByCategory = async (
    req: Request<{ category: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { category } = req.params;
      
      const assessments = await this.assessmentModel.find({ category, isActive: true });

      res.status(200).json({
        success: true,
        data: assessments,
        count: assessments.length,
      });
    } catch (error) {
      logger.error('Error fetching assessments by category:', error);
      next(new AppError('Failed to fetch assessments', 500));
    }
  };
}