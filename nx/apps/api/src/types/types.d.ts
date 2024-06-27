
import { Types, 
    Document as DocumentMongo
 } from 'mongoose';

export type Document<T> = DocumentMongo<Types.ObjectId, any, T>;