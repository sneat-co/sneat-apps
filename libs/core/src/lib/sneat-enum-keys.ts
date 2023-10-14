// https://stackoverflow.com/questions/50376977/generic-type-to-get-enum-keys-as-union-string-in-typescript
export type EnumAsUnionOfKeys<TEnum> = keyof TEnum;
