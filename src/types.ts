export type NotFunction<T> = T extends Function ? never : T;
export type Transform<T> = (input: T) => T;
export type Transformer<T> = { transform: Transform<T> };

export type Resolvable<T> = NotFunction<T> | ((state: any) => T | Resolvable<T>);

export type ClassType<T, TArgs extends any[] = any[]> = {
    new(...args: TArgs): T;
}
export type AddKey<TIn extends {}, TKey extends string, TValue> = TIn & { [k in TKey]: TValue }
export type RemapToResolvable<TIn extends {}> = {
    [k in keyof TIn]: Resolvable<TIn[k]>
}

export interface Dictionary<T> {
    [k: string]: T
}