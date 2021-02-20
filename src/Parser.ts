import BufferInstruction, { BufferInstructionOptions } from "./Instructions/Buffer";
import IntegerInstruction from "./Instructions/Integer";
import MoveInstruction from "./Instructions/Move";
import StringInstruction, { StringInstructionOptions } from "./Instructions/String";
import ParserInstruction from "./ParserInstruction";
import { AddKey, ClassType, Dictionary, NotFunction, RemapToResolvable, Resolvable, Transform } from "./types";

export type InstructionInput<T extends {}> = { buffer: Buffer, offset: { value: number }, parser: Parser<T>, state: any };

class Parser<T extends {} = {}> {
    private instructions: ParserInstruction<any>[] = [];

    constructor() {
        // TODO: Actual constructing
    }

    static resolve<T>(conditional: Resolvable<T>, state: any): T {
        if (typeof conditional === "function")
            return this.resolve((conditional as Transform<T>)(state) as Resolvable<T>, state);
        else
            return conditional;
    }

    static choose<T>(key: Resolvable<string>, results: Dictionary<Resolvable<T>>, defaultValue?: Resolvable<T>): Resolvable<T> {
        return (state) => {
            const rkey = this.resolve(key, state);
            if (rkey in state) {
                const value = state[rkey];
                if (value in results) {
                    return this.resolve(results[value], state);
                } else if (defaultValue) {
                    return this.resolve(defaultValue, state);
                } else {
                    throw new Error(`choose("${rkey}" = ${value}) failed because there was no matching value in the given map, and no default value was provided.`);
                }
            } else {
                throw new Error(`Key \`${key}\` doesn't exist. Only previously parsed keys can be used.`);
            }
        }
    }

    public addAction<TKey extends string | undefined, TOptions, TReturn, TInstruction extends ParserInstruction<TKey, TOptions, TReturn>>(
        key: TKey,
        instruction: ClassType<TInstruction, [key: TKey, options: TOptions]>,
        options: TOptions
    ): TKey extends string ? Parser<AddKey<T, TKey, TReturn>> : Parser<T> {
        this.instructions.push(new instruction(key, options));

        return this as unknown as TKey extends string ? Parser<AddKey<T, TKey, TReturn>> : Parser<T>;
    }

    u8<TKey extends string>(key: TKey): Parser<AddKey<T, TKey, number>> {
        return this.addAction(key, IntegerInstruction, { bits: 8, signed: false }) as Parser<AddKey<T, TKey, number>>;
    }
    u16<TKey extends string>(key: TKey): Parser<AddKey<T, TKey, number>> {
        return this.addAction(key, IntegerInstruction, { bits: 16, signed: false }) as Parser<AddKey<T, TKey, number>>;
    }
    u32<TKey extends string>(key: TKey): Parser<AddKey<T, TKey, number>> {
        return this.addAction(key, IntegerInstruction, { bits: 32, signed: false }) as Parser<AddKey<T, TKey, number>>;
    }
    i8<TKey extends string>(key: TKey): Parser<AddKey<T, TKey, number>> {
        return this.addAction(key, IntegerInstruction, { bits: 8, signed: true }) as Parser<AddKey<T, TKey, number>>;
    }
    i16<TKey extends string>(key: TKey): Parser<AddKey<T, TKey, number>> {
        return this.addAction(key, IntegerInstruction, { bits: 16, signed: true }) as Parser<AddKey<T, TKey, number>>;
    }
    i32<TKey extends string>(key: TKey): Parser<AddKey<T, TKey, number>> {
        return this.addAction(key, IntegerInstruction, { bits: 32, signed: true }) as Parser<AddKey<T, TKey, number>>;
    }
    string<TKey extends string>(key: TKey, options: RemapToResolvable<StringInstructionOptions>): Parser<AddKey<T, TKey, string>> {
        return this.addAction(key, StringInstruction, options) as Parser<AddKey<T, TKey, string>>;
    }
    buffer<TKey extends string>(key: TKey, options: RemapToResolvable<BufferInstructionOptions>): Parser<AddKey<T, TKey, Buffer>> {
        return this.addAction(key, BufferInstruction, options) as Parser<AddKey<T, TKey, Buffer>>;
    }

    move(offset: Resolvable<number>): Parser<T> {
        return this.addAction(undefined, MoveInstruction, { offset }) as Parser<T>;
    }

    parse(input: Buffer): T {
        const state: T = {} as T;
        let offset = { value: 0 };

        for (const instruction of this.instructions) {
            if (instruction.key) {
                (state as any)[instruction.key] = instruction.run({ buffer: input, offset, parser: this, state });
            } else {
                instruction.run({ buffer: input, offset, parser: this, state })
            }
        }

        return state;
    }
}

export default Parser;