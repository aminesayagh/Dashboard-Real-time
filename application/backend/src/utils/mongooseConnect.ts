import mongoose from 'mongoose';

export function generateMongoUri(MONGO_USER: string, MONGO_PASSWORD: string, MONGO_URI: string, MONGO_DB: string): string {
  return `mongodb://${MONGO_USER}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_URI}/${MONGO_DB}?authSource=admin&retryWrites=true&w=majority`;
}

export const dbConnect = async (uri: string): Promise<typeof mongoose> => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri);
      console.log('Database connected successfully');
    } else {
      console.log('Using existing database connection');
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Could not connect to MongoDB');
  }
  return mongoose;
};

export const dbDisconnect = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('Database disconnected successfully');
  }
};

export const clearDatabase = async (): Promise<void> => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
