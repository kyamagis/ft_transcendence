export const FT_API_UID: string = process.env.FT_API_UID || ''
export const FT_API_SECRET: string = process.env.FT_API_SECRET || ''
export const FT_API_DOMAIN = process.env.FT_API_DOMAIN || ''
export const FT_AUTH_CALLBACK_URL: string =
  process.env.FT_AUTH_CALLBACK_URL || ''
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
export const GOOGLE_SECRET = process.env.GOOGLE_SECRET || ''
export const GOOGLE_AUTH_CALLBACK_URL =
  process.env.GOOGLE_AUTH_CALLBACK_URL || ''
export const SESSION_SECRET: string = process.env.SESSION_SECRET || ''

export const POSTGRES_USER = process.env.POSTGRES_USER || ''
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || ''
export const POSTGRES_DB = process.env.POSTGRES_DB || ''

export const DB_HOST = process.env.DB_HOST || ''
export const DB_PORT: number = parseInt(process.env.DB_PORT) || undefined
