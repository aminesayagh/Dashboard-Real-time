import { Types, InferRawDocType, Document } from 'mongoose';

type DefaultObject = {
  createdAt: number;
  updatedAt: number;
};

export type DocumentNotInit<T> = Omit<
  InferRawDocType<T>,
  'createdAt' | 'updatedAt' | '_id'
>;

export type PublicDoc<T extends DefaultDocument<T>> = {
  id: string;
  doc: Pick<DocumentNotInit<T>, keyof DocumentNotInit<T>>;
} & DefaultObject;

type DefaultDocument<T> = Document<Types.ObjectId, unknown, T & DefaultObject>;

export function toPublicDoc<T extends DefaultDocument<T>>(
  doc: T,
): PublicDoc<T> {
  const { _id, createdAt, updatedAt, ...rest } = doc.toObject();

  return {
    id: _id.toHexString(),
    doc: rest as DocumentNotInit<T>,
    createdAt,
    updatedAt,
  };
}
