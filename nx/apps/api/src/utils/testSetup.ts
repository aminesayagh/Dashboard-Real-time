// testSetup.ts
import { MONGO_URI } from '../env';
import { dbConnect, dbDisconnect, clearDatabase  } from './mongooseConnect';

export const setupTestDB = async () => {
  const uri = MONGO_URI;
  await dbConnect(uri);
  await clearDatabase();
};

export const teardownTestDB = async () => {
  await clearDatabase();
  await dbDisconnect();
};
