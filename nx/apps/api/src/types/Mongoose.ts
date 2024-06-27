import { Types, Document } from 'mongoose';
import { BaseDocument as ExternalBaseDocument, DefaultDocument as ExternalDefaultDocument } from 'shared-ts'

export type BaseDocument<T> = ExternalBaseDocument<T, Types.ObjectId>; 
export type DefaultDocument<T> = ExternalDefaultDocument<T, Types.ObjectId, Document<T>>;


export type PublicDocument<T> = ReturnType<DefaultDocument<T>["toObject"]>;

// Type for the object form of the document
export type ObjectDocument<T> = ReturnType<DefaultDocument<T>["toObject"]>;

// Function to convert a Mongoose document to an object with specific fields
export const toObject = <T>(doc: DefaultDocument<T>): ObjectDocument<T> => {
  const obj = doc.toObject();
  obj._id = doc._id;
  obj.created_at = doc.created_at;
  obj.updated_at = doc.updated_at;
  return obj as ObjectDocument<T>;
};

// Function to convert an array of Mongoose documents to objects
export const toObjectArray = <T>(docs: DefaultDocument<T>[]): ObjectDocument<T>[] => 
  docs.map(toObject);

export interface PublicDoc<T extends Document> {
  id: string;
  doc: Omit<T, '_id' | 'createdAt' | 'updatedAt'>;
  createdAt: Date;
  updatedAt: Date;
}

export function toPublicDoc<T extends Document<Types.ObjectId, any, T>>(doc: T): PublicDoc<T> {
  const { _id, createdAt, updatedAt, ...rest }: { _id: Types.ObjectId, createdAt: Date, updatedAt: Date } = doc.toObject();
  return {
    id: _id.toString(),
    doc: {
      ...rest
    } as Omit<T, '_id' | 'createdAt' | 'updatedAt'>,
    createdAt: createdAt,
    updatedAt: createdAt,
  };
}
