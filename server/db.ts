import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '../shared/schema';

// Create a PostgreSQL connection pool
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create a Drizzle database instance
export const db = drizzle(pool, { schema });