// /src/utils/mongooseCache.ts
import { createClient, RedisClientType } from 'redis';
import mongoose, { Query } from 'mongoose';
import { REDIS_URI } from '../env';

// Create Redis client
const redisUrl = REDIS_URI || 'redis://localhost:6379';
const client: RedisClientType = createClient({ url: redisUrl });

// Connect to Redis
client.connect().then(() => {
  console.log('Connected to Redis');
}).catch(err => {
  console.error('Redis connection error:', err);
});

const exec = mongoose.Query.prototype.exec;

// Apply caching to Mongoose queries
export function applyMongooseCache() {
  mongoose.Query.prototype.exec = async function () {
    const key = generateCacheKey(this);

    try {
      const cacheValue = await client.get(key);
      if (cacheValue) {
        console.log("I am cached")
        return JSON.parse(cacheValue);
      }
  
      const args = arguments as any as [];
      const result = await exec.apply(this, args);

      
      if (result) {
        await client.setEx(key, 3600, JSON.stringify(result)); // Cache for 1 hour
      }
  
      return result;
    } catch (err) {
      console.error('Cache error:', err);
      const args = arguments as any as [];
      return exec.apply(this, args);
    }
  };

//   const originalSave = mongoose.Model.prototype.save;
//   mongoose.Model.prototype.save = async function (...args: any) {
//     await invalidateCache(this.constructor.modelName);
//     const result = await originalSave.apply(this, args);
//     await cacheUpdatedData(result); // Re-fetch and cache the updated document
//     return result;
//   };

//   const originalFindOneAndUpdate = mongoose.Model.findOneAndUpdate;
//   mongoose.Model.findOneAndUpdate = async function (...args: any) {
//     const result = await originalFindOneAndUpdate.apply(this, args);
//     if (result) {
//       await invalidateCache(this.modelName);
//       await cacheUpdatedData(result); // Re-fetch and cache the updated document
//     }
//     return result;
//   };

//   async function invalidateCache(modelName: string) {
//     const keyPattern = `*${modelName}*`;
//     const keys = await client.keys(keyPattern);
//     if (keys.length) {
//       await client.del(keys);
//     }
//   }

//   async function cacheUpdatedData(doc: Document) {
//     const query = doc.constructor.findById(doc._id);
//     const key = generateCacheKey(query);
//     const result = await query.exec();
//     if (result) {
//       await client.setEx(key, 3600, JSON.stringify(result)); // Cache for 1 hour
//     }
//   }

  function generateCacheKey(query: Query<any, any>): string {
    return JSON.stringify({
      ...query.getQuery(),
      collection: query.model.collection.name,
      op: (query as any)._op, 
      options: getQueryOptions(query),
      projection: query.projection()
    });
  }

  function getQueryOptions(query: Query<any, any>): Record<string, any> {
    return {
      sort: query.getOptions().sort,
      limit: query.getOptions().limit,
      skip: query.getOptions().skip,
      lean: query.getOptions().lean,
      populate: query.getOptions().populate
    };
  }
}
