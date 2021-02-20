import { InstructionInput } from "../Parser";
import ParserInstruction from "../ParserInstruction";

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