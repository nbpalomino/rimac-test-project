import { createClient, RedisClientType } from '@redis/client'
import { Container } from 'typedi'
import { logger } from '../../app/utils'

let isConnected = false

export const connectRedis = async () => {
  if(!isConnected) {
    const client = await createClient({url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'})
    .on('error', err => logger.error('Redis Client Error: %s', err))
    .connect();

    const conn = client.isReady ? 'SUCCESS' : 'FAILED'
    logger.info('Redis connection is: %s', conn)
    
    isConnected = true
    Container.set('cache', new Cache(client))
  }
}

export class Cache {    
    constructor(
      private client: RedisClientType<any, any, any>
    ) {}
   
    public async setCache<T>(key: string, value: T, ttlInSeconds: number = 10 * 60) {
      try {
        const serializedValue = JSON.stringify(value)
        await this.client.setEx(key, ttlInSeconds, serializedValue); // Use "EX" to set the TTL
        logger.info(`Cache set for key: ${key} with TTL: ${ttlInSeconds} seconds`);
      } catch (error) {
        logger.error("Error setting cache: %s", (error as Error).message);
      }
    }

    public async getCache<T>(key: string): Promise<T | null> {
      try {
        const value = await this.client.get(key);
        if (value) {
          logger.info(`Cache hit for key: ${key}`);
          return JSON.parse(value) as T;
        } else {
          logger.info(`Cache miss for key: ${key}`);
          return null
        }
      } catch (error) {
        logger.error('Error getting cache:', error);
        return null;
      }
    };
}


