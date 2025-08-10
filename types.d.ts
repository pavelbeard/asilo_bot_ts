declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ADMIN_API_TOKEN: string
      ASILO_BOT: string
      SERVERLESS: string
      WEBHOOK_HOST: string
      WEBHOOK_SECRET: string
    }
  }
}

export {}
