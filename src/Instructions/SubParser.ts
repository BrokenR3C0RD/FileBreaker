import Parser, { InstructionInput, ParserInstruction } from "../Parser";

export type SubParserInstructionOptions<T extends {}> = {
    parser: Parser<T>
    data?: string
}

class SubParserInstruction<TKey extends string = "", TParent extends {} = {}> extends ParserInstruction<TKey, SubParserInstructionOptions<TParent>, TParent>{
    parse<T>({ buffer, offset, state }: InstructionInput<T>) {
        const { parser } = this.resolvedOptions;
        const data = this.resolvedOptions.data ? state[this.resolvedOptions.data] : buffer.slice(offset.value);
        const result = parser!.parse(data, state);

        if (this.resolvedOptions.data == null)
            offset.value += result._offset.value;

        return result;
    }
}

export default SubParserInstruction;