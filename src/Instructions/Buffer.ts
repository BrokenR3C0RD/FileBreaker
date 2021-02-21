import { InstructionInput, ParserInstruction } from "../Parser";
import { Transformer } from "../types";

export type BufferInstructionOptions = {
    transform?: Transformer<Buffer> | undefined
} & ({
    size: number,
} | {
    start?: number;
    end?: number
})

class BufferInstruction<TKey extends string = ""> extends ParserInstruction<TKey, BufferInstructionOptions, Buffer>{
    parse<T>({ buffer, offset }: InstructionInput<T>) {
        const options = this.resolvedOptions;
        let res: Buffer;

        if ("size" in options && options["size"] != null) {
            const size = options["size"]!;

            res = Buffer.alloc(size);
            buffer.copy(res, 0, offset.value, offset.value += size);
        } else {
            const start = "start" in options && options.start
                ? Math.sign(options.start) === -1 ? (buffer.length + options.start) : options.start
                : offset.value;
            const end = "end" in options && options.end
                ? Math.sign(options.end) === -1 ? (buffer.length + options.end) : options.end
                : buffer.length - 1

            res = Buffer.alloc(end - start);
            buffer.copy(res, 0, start, offset.value = end);
        }

        if (options.transform) {
            res = options.transform.transform(res)!;
        }

        return res;
    }
}

export default BufferInstruction;