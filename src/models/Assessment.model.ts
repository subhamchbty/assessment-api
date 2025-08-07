import mongoose, { Schema, Model } from 'mongoose';
import { IAssessmentDocument } from '../types/assessment.types';

const QuestionSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer', 'essay'],
    required: true,
  },
  options: {
    type: [String],
    required: function(this: any) {
      return this.type === 'multiple-choice';
    },
  },
  correctAnswer: {
    type: Schema.Types.Mixed,
  },
  points: {
    type: Number,
    required: true,
    min: 0,
  },
  required: {
    type: Boolean,
    default: true,
  },
});

const AssessmentSchema = new Schema<IAssessmentDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: ['quiz', 'exam', 'survey', 'assignment'],
      required: true,
    },
    questions: {
      type: [QuestionSchema],
      required: true,
      validate: {
        validator: function(questions: any[]) {
          return questions.length > 0;
        },
        message: 'Assessment must have at least one question',
      },
    },
    duration: {
      type: Number,
      min: 0,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    passingScore: {
      type: Number,
      min: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    instructions: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(_doc, ret) {
        const { __v, ...result } = ret;
        return result;
      },
    },
  }
);

AssessmentSchema.index({ title: 'text', description: 'text' });
AssessmentSchema.index({ type: 1, category: 1 });
AssessmentSchema.index({ isActive: 1 });
AssessmentSchema.index({ createdAt: -1 });

AssessmentSchema.pre('save', function(next) {
  const totalScore = this.questions.reduce((sum, question) => sum + question.points, 0);
  this.totalScore = totalScore;
  next();
});

AssessmentSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate() as any;
  if (update.questions) {
    const totalScore = update.questions.reduce((sum: number, question: any) => sum + question.points, 0);
    update.totalScore = totalScore;
  }
  next();
});

export class AssessmentModel {
  private static model: Model<IAssessmentDocument>;

  static getModel(): Model<IAssessmentDocument> {
    if (!this.model) {
      this.model = mongoose.model<IAssessmentDocument>('Assessment', AssessmentSchema);
    }
    return this.model;
  }
}