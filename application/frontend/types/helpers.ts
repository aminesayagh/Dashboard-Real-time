export type LooseAutocomplete<T extends string> = T | Omit<string, T>;

export type NestedWithoutKey<T, Key extends string> = {
    [K in keyof T]:
        K extends Key
            ? never
            : T[K] extends string ? K : (NestedWithoutKey<T[K], Key> | K);
}[keyof T];

// const test = {
//     a: {
//         b: {
//             path: '/dash/account/profile'
//         }
//     }
// }

// const validString: TypeOfValidString = 'a.b';