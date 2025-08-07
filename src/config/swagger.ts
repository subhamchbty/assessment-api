import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './config';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Assessment API',
      version: '1.0.0',
      description: 'A RESTful API service for managing assessments',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}${config.apiPrefix}`,
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Question: {
          type: 'object',
          required: ['id', 'text', 'type', 'points', 'required'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the question',
            },
            text: {
              type: 'string',
              description: 'The question text',
            },
            type: {
              type: 'string',
              enum: ['multiple-choice', 'true-false', 'short-answer', 'essay'],
              description: 'Type of question',
            },
            options: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Options for multiple-choice questions',
            },
            correctAnswer: {
              oneOf: [
                { type: 'string' },
                { type: 'array', items: { type: 'string' } },
              ],
              description: 'Correct answer(s)',
            },
            points: {
              type: 'number',
              minimum: 0,
              description: 'Points for this question',
            },
            required: {
              type: 'boolean',
              default: true,
              description: 'Whether this question is required',
            },
          },
        },
        Assessment: {
          type: 'object',
          required: ['title', 'description', 'type', 'questions'],
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier',
            },
            title: {
              type: 'string',
              maxLength: 200,
              description: 'Assessment title',
            },
            description: {
              type: 'string',
              maxLength: 1000,
              description: 'Assessment description',
            },
            type: {
              type: 'string',
              enum: ['quiz', 'exam', 'survey', 'assignment'],
              description: 'Type of assessment',
            },
            questions: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Question',
              },
              minItems: 1,
              description: 'List of questions',
            },
            duration: {
              type: 'integer',
              minimum: 0,
              description: 'Duration in seconds',
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'Start date and time',
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              description: 'End date and time',
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'Whether the assessment is active',
            },
            passingScore: {
              type: 'number',
              minimum: 0,
              description: 'Minimum score to pass',
            },
            totalScore: {
              type: 'number',
              description: 'Total score (calculated)',
            },
            instructions: {
              type: 'string',
              description: 'Instructions for the assessment',
            },
            category: {
              type: 'string',
              description: 'Assessment category',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Tags for categorization',
            },
            createdBy: {
              type: 'string',
              description: 'Creator of the assessment',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              description: 'Error message',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
              description: 'Validation errors',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
            message: {
              type: 'string',
              description: 'Success message',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Assessment',
              },
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  example: 1,
                },
                limit: {
                  type: 'integer',
                  example: 10,
                },
                totalCount: {
                  type: 'integer',
                  example: 50,
                },
                totalPages: {
                  type: 'integer',
                  example: 5,
                },
              },
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        InternalError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/app.ts'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);