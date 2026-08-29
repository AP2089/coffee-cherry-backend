import dotenv from 'dotenv'

dotenv.config()

export const env = {
  port: Number(process.env.PORT) || 3001,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/coffee_cherry',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
} as const
