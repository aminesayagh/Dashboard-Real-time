import { Types, Document } from 'mongoose';

type DefaultKeys = '_id' | 'createdAt' | 'updatedAt';

export interface PublicDoc<T extends Document<Types.ObjectId>> {
  id: string;
  doc: Omit<T, DefaultKeys>;
  createdAt: Date;
  updatedAt: Date;
}

export function toPublicDoc<T extends Document<Types.ObjectId, any, T>>(doc: T): PublicDoc<T> {
  const { _id, createdAt, updatedAt, ...rest }: { _id: Types.ObjectId, createdAt: Date, updatedAt: Date } = doc.toObject();
  return {
    id: _id.toString(),
    doc: {
      ...rest
    } as Omit<T, DefaultKeys>,
    createdAt: createdAt,
    updatedAt: createdAt,
  };
}


export type PublicDocArray<T extends Document<Types.ObjectId>> = PublicDoc<T>[];

export function toPublicDocArray<T extends Document<Types.ObjectId, any, T>>(docs: T[]): PublicDocArray<T> {
  return docs.map(toPublicDoc);
}