import { InstructionInput, ParserInstruction } from "../Parser";
import { Endian } from "../types";

interface DecimalInstructionOptions {
    bits: number,
    endian?: Endian
}

class DecimalInstruction<TKey extends string = ""> extends ParserInstruction<TKey, DecimalInstructionOptions, number>{
    parse<T>({ buffer, offset, state }: InstructionInput<T>) {
        let { bits } = this.resolvedOptions;
        if (bits == null || bits < 32) {
            throw new Error(`bits argument: ${bits} < 32`);
        } else if (bits % 32 !== 0) {
            throw new Error(`bits needs to be a multiple of 32 (got ${bits})`);
        } else {
            let res: number;

            switch (bits) {
                case 32:
                    res = buffer.readFloatLE(offset.value);
                    break;
                case 64:
                    res = buffer.readDoubleLE(offset.value);
                    break;
                default:
                    throw new TypeError(`decimal bit width ${bits} not implemented`)
            }

            offset.value += bits / 8;
            return res;
        }
    }
}

export default DecimalInstruction;