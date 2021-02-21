import type Parser from "./Parser";

export type NotFunction<T> = T extends Function ? never : T;
export type Transform<T> = (input: T) => T;
export type Transformer<T> = { transform: Transform<T> };

export type Resolvable<T> = NotFunction<T> | ((state: any) => T | Resolvable<T>);

export type ClassType<T, TArgs extends any[] = any[]> = {
    new(...args: TArgs): T;
}

export type AddKey<TIn extends {}, TKey extends string, TValue> = Id<TIn & { [k in TKey]: TValue }>
export type RemapToResolvable<TIn extends {}> = {
    [k in keyof TIn]: Resolvable<TIn[k]>
}
export type Id<T> = {} & { [P in keyof T]: T[P] }

export type Values<T> = T extends { [k in keyof T]: infer U } ? U : never;

export type Dictionary<T> = {
    [k: string]: T | T
}

export type ExtractParserType<TParser extends Parser<any>> = TParser extends Parser<infer T> ? T : never;

export type ValidArrayType = "u8" | "u16" | "u32" | "i8" | "i16" | "i32" | "f32" | "f64";
export type TypedArray = Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array;