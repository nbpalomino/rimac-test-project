import { DataSource } from 'typeorm'
import { logger } from '../../app/utils'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'mysql',
  synchronize: true,
  logging: false,
  entities: ["./src/persistence/entity/*.ts"], //[Catalog, Provider, Product],
  subscribers: [],
  migrations: []
})

export const connectDB = async (): Promise<void> => {
    let client: DataSource
    try {
      if(!AppDataSource.isInitialized) {
        client = await AppDataSource.initialize()
        logger.info('Database connection established!')
      }
    } catch (err) {
      logger.error('Error connecting to Database: %s', err)
      throw err
    }
}
export const closeDB = async (): Promise<void> => {
    try {
      await AppDataSource.destroy()
      logger.info('Database connection CLOSED!')
    } catch (err) {
      logger.error('Error closing Database: %s', err)
      throw err
    }
}