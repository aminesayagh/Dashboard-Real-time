// import { NextFunction } from 'express';
// // /src/utils/mongooseCache.ts
// // import { createClient, RedisClientType } from 'redis';
// import { ApiRequest, ApiResponse } from '../types/Api';
// import Redis from '../utils/Redis';


// // Middleware to handle caching for GET requests
// export const cacheMiddleware = async (
//   req: ApiRequest,
//   res: ApiResponse<unknown>,
//   next: NextFunction,
// ) => {
//   if (req.method === 'GET') {
//     const key = req.originalUrl;
//     try {
//       const data = await Redis.get(key);
//       if (data) {
//         console.log('I am cached');
//         res.send(JSON.parse(data));
//       } else {
//         const originalSend = res.send.bind(res);
//         res.send = (body) => {
//           redisClient.setEx(key, 3600, JSON.stringify(body)); // Cache for 1 hour
//           return originalSend(body);
//         };
//         next();
//       }
//     } catch (err) {
//       console.error(err);
//       next();
//     }
//   } else {
//     next();
//   }
// };

// export const invalidateCacheMiddleware = async (
//   req: ApiRequest,
//   _: ApiResponse<unknown>,
//   next: NextFunction,
// ) => {
//   if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
//     const baseUrl = req.baseUrl || req.url;
//     const parts = baseUrl.split('/');
//     parts.pop();
//     const pattern = `${parts.join('/')}*`;
//     try {
//       const keys = await redisClient.keys(pattern);
//       if (keys.length > 0) {
//         await redisClient.del(keys);
//         console.log(`Invalidated cache for keys: ${keys.join(', ')}`);
//       }
//       next();
//     } catch (err) {
//       console.error(err);
//       next();
//     }
//   } else {
//     next();
//   }
// };

// export default redisClient;
