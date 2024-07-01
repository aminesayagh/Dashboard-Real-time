import { MONGO_USER, MONGO_PASSWORD, MONGO_URI, MONGO_TEST_DB } from '../env';
import { connectRedis, disconnectRedis } from '../middlewares/mongooseCache';
import { dbConnect, dbDisconnect, clearDatabase, generateMongoUri } from './mongooseConnect';

export const setupTestDB = async () => {
  const uri = generateMongoUri(MONGO_USER, MONGO_PASSWORD, MONGO_URI, MONGO_TEST_DB);
  await dbConnect(uri);
  await clearDatabase();
  await connectRedis();
};

export const teardownTestDB = async () => {
  await clearDatabase();
  await dbDisconnect();
  await disconnectRedis();
};