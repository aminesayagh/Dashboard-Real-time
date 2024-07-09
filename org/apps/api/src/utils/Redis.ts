import { createClient, RedisClientType } from 'redis';
import { REDIS_URI } from '../env';

export default class Redis {
    public redisClient: RedisClientType;

    private constructor() {
        this.redisClient = createClient({ url: REDIS_URI });
    };
    public async connect() {
        await this.redisClient.connect().then(() => {
            console.log('Connected to Redis');
        }).catch((err: Error) => {
            console.error('Redis connection error:');
            console.error(err);
            throw err;
        });
    }
    // Add all the necessary redis methods here
    

    public static create() {
        return new Redis();
    }
}
