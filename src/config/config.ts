import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  port: number;
  nodeEnv: string;
  mongoUri: string;
  apiPrefix: string;
  logLevel: string;
}

export const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/assessment_db',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  logLevel: process.env.LOG_LEVEL || 'info',
};