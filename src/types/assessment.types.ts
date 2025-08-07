export interface IQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  required: boolean;
}

export interface IAssessment {
  _id?: string;
  title: string;
  description: string;
  type: 'quiz' | 'exam' | 'survey' | 'assignment';
  questions: IQuestion[];
  duration?: number;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  passingScore?: number;
  totalScore: number;
  instructions?: string;
  category?: string;
  tags?: string[];
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAssessmentDocument extends IAssessment {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAssessmentDto {
  title: string;
  description: string;
  type: 'quiz' | 'exam' | 'survey' | 'assignment';
  questions: IQuestion[];
  duration?: number;
  startDate?: Date;
  endDate?: Date;
  passingScore?: number;
  instructions?: string;
  category?: string;
  tags?: string[];
  createdBy?: string;
}

export interface UpdateAssessmentDto extends Partial<CreateAssessmentDto> {
  isActive?: boolean;
}

export interface AssessmentQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  type?: string;
  category?: string;
  isActive?: boolean;
}