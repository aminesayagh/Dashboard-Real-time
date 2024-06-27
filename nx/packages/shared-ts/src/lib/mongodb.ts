

export type BaseDocument<T, ObjectId> = {
    _id: ObjectId;
    created_at: string;
    updated_at: string;
} & T;

// Default document type with necessary fields and methods
export type DefaultDocument<T, O, Document> = Omit<Document, "toObject"> & {
    toObject: () => BaseDocument<T, O>;
  } & BaseDocument<T, O>;
