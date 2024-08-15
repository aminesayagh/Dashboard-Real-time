import { createClient, RedisClientType } from 'redis';
import { REDIS_URI } from '../env';

class Redis {
  public redisClient: RedisClientType;
  public static instance: Redis;

  private constructor() {
    this.redisClient = createClient({ url: REDIS_URI });
    this.redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });
    this.redisClient.on('ready', () => {
      console.log('Redis is ready');
    });
    this.connect();
  }
  public async connect() {
    await this.redisClient
      .connect()
      .then(() => {
        console.log('Connected to Redis');
      })
      .catch((err: Error) => {
        console.error('Redis connection error:');
        console.error(err);
        throw err;
      });
  }
  // Add all the necessary redis methods here

  public static create() {
    if (!Redis.instance) {
      Redis.instance = new Redis();
    }
    return Redis.instance;
  }

  public async disconnect() {
    await this.redisClient
      .quit() 
      .then(() => {
        console.log('Disconnected from Redis');
      })
      .catch((err: Error) => {
        console.error('Redis disconnection error:');
        console.error(err);
        throw err;
      });
    }
  
  public async clear() {
    await this.redisClient
      .flushAll()
      .then(() => {
        console.log('Cleared Redis');
      })
      .catch((err: Error) => {
        console.error('Redis clear error:');
        console.error(err);
        throw err;
      });
  }

  public async set(key: string, value: string) {
    await this.redisClient
      .set(key, value)
      .then(() => {
        console.log('Set key:', key);
      })
      .catch((err: Error) => {
        console.error('Redis set error:');
        console.error(err);
        throw err;
      });
  }

  public async get(key: string): Promise<string | null> {
    return await this.redisClient
      .get(key);
  }

  public async del(key: string) {
    await this.redisClient
      .del(key)
      .then(() => {
        console.log('Deleted key:', key);
      })
      .catch((err: Error) => {
        console.error('Redis delete error:');
        console.error(err);
        throw err;
      });
  }

  public async incr(key: string) {
    await this.redisClient
      .incr(key)
      .then(() => {
        console.log('Incremented key:', key);
      })
      .catch((err: Error) => {
        console.error('Redis increment error:');
        console.error(err);
        throw err;
      });
  }
}

const redisClient = Redis.create();
export default redisClient;  