export const API_URL = process.env.NEXT_PUBLIC_API_URL as string

export const API_MOCKING = process.env.NEXT_PUBLIC_API_MOCKING === 'true'

export const IS_BROWSER = typeof window !== 'undefined'
export const IS_SERVER = typeof window === 'undefined'
