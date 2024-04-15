import {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  DB_HOST,
  DB_PORT,
} from '@/config'
import { Pool } from 'pg'
import * as connectPg from 'connect-pg-simple'
import * as session from 'express-session'

const pgPool = new Pool({
  user: POSTGRES_USER,
  host: DB_HOST,
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
  port: DB_PORT,
})

const sessionStore = new (connectPg(session))({
  pool: pgPool,
  tableName: 'Session',
})

export default sessionStore
