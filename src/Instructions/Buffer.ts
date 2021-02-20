import { InstructionInput } from "../Parser";
import ParserInstruction from "../ParserInstruction";

export type BufferInstructionOptions = {
    size: number
}

class BufferInstruction<TKey extends string = ""> extends ParserInstruction<TKey, BufferInstructionOptions, Buffer>{
    parse<T>({ buffer, offset }: InstructionInput<T>) {
        const { size } = this.resolvedOptions;

        let res = Buffer.alloc(size!);
        buffer.copy(res, 0, offset.value, offset.value += size!);

        return res;
    }
}

export default BufferInstruction;