import { Types, Document } from 'mongoose';



export interface PublicDoc<T extends Document<Types.ObjectId>> {
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


export type PublicDocArray<T extends Document<Types.ObjectId>> = PublicDoc<T>[];

export function toPublicDocArray<T extends Document<Types.ObjectId, any, T>>(docs: T[]): PublicDocArray<T> {
  return docs.map(toPublicDoc);
}