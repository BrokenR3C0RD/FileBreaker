import Parser, { InstructionInput, ParserInstruction } from "../Parser";
import { ExtractParserType } from "../types";

export type SubParserInstructionOptions<TParser extends Parser<any>> = {
    parser: Parser<ExtractParserType<TParser>>;
    data?: string
}

class SubParserInstruction<TParent extends Parser<any>, TKey extends string = ""> extends ParserInstruction<TKey, SubParserInstructionOptions<TParent>, TParent>{
    parse<T>({ buffer, offset, state }: InstructionInput<T>) {
        const { parser } = this.resolvedOptions;
        const data = this.resolvedOptions.data ? state[this.resolvedOptions.data] : buffer.slice(offset.value);
        const result = parser!._parseWithOffset(data, state);

        if (this.resolvedOptions.data == null)
            offset.value += result._offset.value;

        return result;
    }
}

export default SubParserInstruction;