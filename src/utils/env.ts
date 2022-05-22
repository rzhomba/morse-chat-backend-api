import dotenv from 'dotenv'

const config = dotenv.config()

if (config.error) {
  throw config.error
}

export const applicationPort = Number(config.parsed?.APPLICATION_PORT ?? 0)
export const dbConnection = String(config.parsed?.DB_CONNECTION ?? '')
export const corsOrigin = String(config.parsed?.CORS_ORIGIN ?? '')
export const jwtSecret = String(config.parsed?.JWT_SECRET ?? '')
