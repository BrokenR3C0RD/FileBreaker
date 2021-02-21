import ParserInstruction from "./ParserInstruction";
import BufferInstruction, { BufferInstructionOptions } from "./Instructions/Buffer";
import IntegerInstruction from "./Instructions/Integer";
import MoveInstruction from "./Instructions/Move";
import StringInstruction, { StringInstructionOptions } from "./Instructions/String";
import { AddKey, ClassType, Dictionary, RemapToResolvable, Resolvable, Transform } from "./types";
import Inflate from "./Transform/Inflate";
import SubParserInstruction, { SubParserInstructionOptions } from "./Instructions/SubParser";
import ArrayInstruction, { ArrayInstructionOptions } from "./Instructions/Array";
import ndarray from "ndarray";

export type InstructionInput<T extends {}> = { buffer: Buffer, offset: { value: number }, parser: Parser<T>, state: any };

class Parser<T extends {} = {}> {
    static Transform = {
        Inflate
    }

    static choose<T>(key: Resolvable<string>, results: Dictionary<Resolvable<T>>): Resolvable<T>;
    static choose<T, TDef = T>(key: Resolvable<string>, results: Dictionary<Resolvable<T>>, defaultValue: Resolvable<TDef>): Resolvable<T | TDef>;
    static choose<T, TDef = undefined>(key: Resolvable<string>, results: Dictionary<Resolvable<T>>, defaultValue?: Resolvable<TDef> | undefined): Resolvable<T | TDef> {
        return (state) => {
            const rkey = this.resolve(key, state);
            if (rkey && rkey in state) {
                const value = state[rkey];
                if (value in results) {
                    return this.resolve(results[value], state);
                } else if (arguments.length === 3) {
                    return this.resolve<TDef>(defaultValue as Resolvable<TDef>, state);
                } else {
                    throw new Error(`choose("${rkey}" = ${value}) failed because there was no matching value in the given map, and no default value was provided.`);
                }
            } else {
                throw new Error(`Key \`${rkey}\` doesn't exist. Only previously parsed keys can be used.`);
            }
        }
    }
    static pick<TKey extends string>(key: Resolvable<TKey>): Resolvable<any> {
        return (state: any) => {
            const rkey = this.resolve(key, state);
            if (rkey && rkey in state) {
                return state[rkey];
            } else {
                throw new Error(`Key \`${rkey}\` doesn't exist. Only previously parsed keys can be used.`);
            }
        }
    }

    private instructions: ParserInstruction<any>[] = [];

    constructor() {
        // TODO: Actual constructing
    }

    public static resolve<T>(conditional: Resolvable<T>, state: any): T {
        if (typeof conditional === "function")
            return this.resolve((conditional as Transform<T>)(state) as Resolvable<T>, state);
        else
            return conditional;
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
    string<TKey extends string>(key: TKey, options: RemapToResolvable<StringInstructionOptions> = {}): Parser<AddKey<T, TKey, string>> {
        return this.addAction(key, StringInstruction, options) as Parser<AddKey<T, TKey, string>>;
    }
    buffer<TKey extends string>(key: TKey, options: RemapToResolvable<BufferInstructionOptions>): Parser<AddKey<T, TKey, Buffer>> {
        return this.addAction(key, BufferInstruction, options) as Parser<AddKey<T, TKey, Buffer>>;
    }
    array<TKey extends string>(key: TKey, options: RemapToResolvable<ArrayInstructionOptions>): Parser<AddKey<T, TKey, ndarray<number>>> {
        return this.addAction(key, ArrayInstruction, options) as Parser<AddKey<T, TKey, ndarray<number>>>;
    }
    move(offset: Resolvable<number>): Parser<T> {
        return this.addAction(undefined, MoveInstruction, { offset }) as Parser<T>;
    }

    next<TKey extends string, TSub extends {}>(key: TKey, options: RemapToResolvable<SubParserInstructionOptions<TSub>>): Parser<AddKey<T, TKey, TSub>> {
        return this.addAction(key, SubParserInstruction, options) as Parser<AddKey<T, TKey, TSub>>;
    }

    parse(input: Buffer, parentState?: any): T & { _offset: { value: number } } {
        const state: T = {} as T;
        let offset = { value: 0 };

        for (const instruction of this.instructions) {
            try {
                if (instruction.key) {
                    (state as any)[instruction.key] = instruction.run({ buffer: input, offset, parser: this, state: { ...parentState, ...state } });
                } else {
                    instruction.run({ buffer: input, offset, parser: this, state })
                }
            } catch (e) {
                throw new Error(`Error while parsing key \`${instruction.key}\` (offset: ${offset.value}): ${e.message}`);
            }
        }

        return { ...state, _offset: offset };
    }
}

export default Parser;
export { ParserInstruction };