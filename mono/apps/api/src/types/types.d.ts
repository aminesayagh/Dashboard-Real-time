import { Types, Document as DocumentMongo } from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Document<T> = DocumentMongo<Types.ObjectId, any, T>;
