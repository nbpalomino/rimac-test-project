import 'dotenv/config'
import 'reflect-metadata'
import { server } from './src/app/http/server'
import { connectDB } from './src/persistence/database'
import { connectRedis } from './src/persistence/database/redis'
import { logger } from './src/app/utils'
// <> <History>

const port = process.env.PORT || 8080

connectDB()
  .then(() => {
    server.listen(port, () => logger.info("Express is ready in port: %s", port))
  })
  .then(() => {
    connectRedis()
  })
  .catch(err => {
    logger.error("DB connection: %s", err)
    process.exit()
  })
