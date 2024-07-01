import { Types, InferRawDocType, Document } from 'mongoose';

type DefaultObject = {
  createdAt: number;
  updatedAt: number;
}

export  type PublicDoc<T extends DefaultDocument<T>> = {
  id: string;
  doc: Omit<InferRawDocType<T>, '_id' | 'createdAt' | 'updatedAt'>;
  createdAt: number;
  updatedAt: number; 
}

type DefaultDocument<T> = Document<Types.ObjectId, unknown, T & DefaultObject>;

export function toPublicDoc<T extends DefaultDocument<T>>(doc: T): PublicDoc<T> {
  const { _id, createdAt, updatedAt, ...rest } = doc.toObject();
  return {
    id: _id.toHexString(),
    doc: rest as Omit<InferRawDocType<T>, '_id' | 'createdAt' | 'updatedAt'>,
    createdAt,
    updatedAt,
  };
}
