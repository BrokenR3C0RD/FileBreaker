import { InstructionInput, ParserInstruction } from "../Parser";

interface MoveInstructionOptions {
    offset: number
}

class MoveInstruction extends ParserInstruction<undefined, MoveInstructionOptions, void>{
    parse<T>({ offset }: InstructionInput<T>) {
        let { offset: resOffset } = this.resolvedOptions;
        offset.value = resOffset!;
    }
}

export default MoveInstruction;