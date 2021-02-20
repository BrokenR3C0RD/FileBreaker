import Parser, { InstructionInput } from "./Parser";
import { RemapToResolvable } from "./types";

abstract class ParserInstruction<TKey extends string | undefined = string, TOptions extends {} = any, TReturn = unknown> {
    constructor(
        public readonly key: TKey,
        private options: RemapToResolvable<TOptions>
    ) {

    }

    protected resolvedOptions: Partial<TOptions> = {};

    protected resolveOptions(state: any) {
        for (let key in this.options) {
            const value = Parser.resolve(this.options[key], state);
            this.resolvedOptions[key] = value;
        }
    }

    public run<T extends {}>(input: InstructionInput<T>): TReturn {
        this.resolveOptions(input.state);
        return this.parse(input);
    }

    abstract parse<T extends {}>({ buffer, offset, parser }: InstructionInput<T>): TReturn;
}
export default ParserInstruction;