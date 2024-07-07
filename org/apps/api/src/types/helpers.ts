
type DeepPartialArray<Thing> = Array<DeepPartial<Thing>>;
type DeepPartialObject<Thing> = {
    [Key in keyof Thing]?: DeepPartial<Thing[Key]>;
}

// DeepPartial is a type that allows you to create a partial type of a deeply nested object.
export type DeepPartial<Thing> = Thing extends () => void
    ? Thing
    : Thing extends Array<infer InferArrayMember>
        ? DeepPartialArray<InferArrayMember>
        : Thing extends object
            ? DeepPartialObject<Thing>
            : Thing;

// LooseAutocomplete is a type that allows you to use a string or an object that is not a string.
export type LooseAutocomplete<T extends string> = T | Omit<string, T>;

// objectKeys is a function that returns the keys of an object.
export const objectKeys = <O extends object>(obj: O): (keyof O)[] => {
    return Object.keys(obj) as (keyof O)[];
}