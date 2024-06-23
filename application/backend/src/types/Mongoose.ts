import { Types, Document } from "mongoose";

export type DocumentBase<T> = {
    _id: Types.ObjectId;
    created_at: string;
    updated_at: string;
} & T;

// Default document type with necessary fields and methods
export type DefaultDocument<T> = Omit<Document, "toObject"> & {
    toObject: () => DocumentBase<T>;
  } & DocumentBase<T>;

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
