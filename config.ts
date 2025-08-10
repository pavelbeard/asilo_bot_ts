import { configDotenv } from 'dotenv'

configDotenv({
  path: './.env.local',
})

export const ASILO_BOT = process.env.ASILO_BOT || ''
export const SERVERLESS = ['true', '1', 'yes'].includes(
  process.env.SERVERLESS || ''
)
