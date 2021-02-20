import { InstructionInput } from "../Parser";
import ParserInstruction from "../ParserInstruction";

export enum StringTrimType {
    None = 0,
    AfterNull = 1
}

export type StringInstructionOptions = {
    trim?: StringTrimType,
    encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex"
} & ({
    size: number
    readToNull?: false
})

class StringInstruction<TKey extends string = ""> extends ParserInstruction<TKey, StringInstructionOptions, string>{
    parse<T>({ buffer, offset }: InstructionInput<T>) {
        const { size, encoding } = this.resolvedOptions;

        // TODO: Handle readToNull
        let res = buffer.toString(encoding, offset.value, offset.value += size!);

        // TODO: Add TrimType
        return res;
    }
}

export default StringInstruction;