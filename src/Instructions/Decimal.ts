import { InstructionInput, ParserInstruction } from "../Parser";

interface DecimalInstructionOptions {
    bits: number,
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
                    res = buffer.readFloatLE(bits);
                    break;
                case 64:
                    res = buffer.readDoubleLE(bits);
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