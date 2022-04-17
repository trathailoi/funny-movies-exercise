import { join } from 'path'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

export const dbConfig = (): PostgresConnectionOptions => ({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../database/migration/**/*{.ts,.js}')],
  cli: {
    migrationsDir: join(__dirname, '../database/migration'),
    entitiesDir: join(__dirname, '../**/*.entity{.ts,.js}')
  }
})

export default dbConfig()
