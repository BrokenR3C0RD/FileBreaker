import type Parser from "./Parser";

export type NotFunction<T> = T extends Function ? never : T;
export type Transform<T> = (input: T) => T;
export type Transformer<T> = { transform: Transform<T>; };

export type Resolvable<T> = NotFunction<T> | ((state: any) => T | Resolvable<T>);

export type ExtractResolvable<T extends Resolvable<any>> = T extends Resolvable<infer U> ? U : never;

export type ClassType<T, TArgs extends any[] = any[]> = {
    new(...args: TArgs): T;
};

export type AddKey<TIn extends {}, TKey extends string, TValue> = Id<TIn & { [ k in TKey ]: TValue }>;

export type RemapToResolvable<TIn extends Dictionary<any>> = {
    [ k in keyof TIn ]: Resolvable<TIn[ k ]>
};

export type RemapToResolved<TIn extends Dictionary<any>> = {
    [k in keyof TIn]: ExtractResolvable<TIn[ k ]>
}

export type Id<T> = {} & { [ P in keyof T ]: T[ P ] };

export type Values<T> = T extends { [ k in keyof T ]: infer U } ? U : never;

export interface Dictionary<T> {
    [ k: string ]: T;
}


export type ExtractParserType<TParser extends Parser<any>> = TParser extends Parser<infer T> ? T : never;
export type ValidArrayType = "u8" | "u16" | "u32" | "i8" | "i16" | "i32" | "f32" | "f64";
export type TypedArray = Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array;

export type ParserValues<T extends Dictionary<Parser<any>>> = ExtractParserType<Values<T>>;
export type ResolvableParserValues<T extends Dictionary<Resolvable<Parser<any>>>> = ExtractParserType<ExtractResolvable<Values<T>>>;

export type ResolvableParserType<TParser extends Dictionary<Parser<any>>, TState extends {}, TKey extends keyof TState> =
    keyof TState extends TKey
    ? ResolvableParserValues<TParser>
    : never;

export enum Endian {
    Little,
    Big
}