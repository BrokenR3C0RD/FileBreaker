import { InstructionInput } from "../Parser";
import ParserInstruction from "../ParserInstruction";

interface IntegerInstructionOptions {
    bits: number,
    signed: boolean
}

class IntegerInstruction<TKey extends string = ""> extends ParserInstruction<TKey, IntegerInstructionOptions, number>{
    parse<T>({ buffer, offset, state }: InstructionInput<T>) {
        let { bits, signed } = this.resolvedOptions;
        if (bits == null || bits < 8) {
            throw new Error(`bits argument: ${bits} < 8`);
        } else if (bits % 8 !== 0) {
            throw new Error(`bits needs to be a multiple of 8 (got ${bits})`);
        } else {
            const res = signed
                ? buffer.readIntLE(offset.value, bits / 8)
                : buffer.readUIntLE(offset.value, bits / 8);

            offset.value += bits / 8;
            return res;
        }
    }
}

export default IntegerInstruction;