import { InstructionInput, ParserInstruction } from "../Parser";

export enum StringTrimType {
    None = 0,
    AfterNull = 1
}

export type StringInstructionOptions = {
    trim?: StringTrimType,
    encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex"
    size?: number
    readToNull?: false
}

class StringInstruction<TKey extends string = ""> extends ParserInstruction<TKey, StringInstructionOptions, string>{
    parse<T>({ buffer, offset }: InstructionInput<T>) {
        const { size, encoding, trim } = this.resolvedOptions;

        let res: string;
        // TODO: Handle readToNull
        if (size != null) {
            res = buffer.toString(encoding, offset.value, offset.value += size);
        } else {
            res = buffer.toString(encoding, offset.value);
            offset.value = buffer.length - 1;
        }


        switch (trim) {
            case StringTrimType.AfterNull:
                res = res.replace(/^([^\0]+?)?\0.+?$/, "$1");
                break;
        }
        return res;
    }
}

export default StringInstruction;