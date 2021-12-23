import Parser, { InstructionInput } from "./Parser";
import { ExtractResolvable, RemapToResolvable, RemapToResolved, Resolvable } from "./types";

abstract class ParserInstruction<TKey extends string | undefined = string, TOptions extends {} = any, TReturn = unknown> {
    constructor(
        public readonly key: TKey,
        private options: RemapToResolvable<TOptions>
    ) {

    }

    protected resolvedOptions: Partial<RemapToResolved<TOptions>> = {};

    protected resolveOptions(state: any) {
        for (let key in this.options) {
            let option = this.options[ key ] as Resolvable<ExtractResolvable<TOptions[ typeof key ]>>;

            const value = Parser.resolve(option, state);
            this.resolvedOptions[ key ] = value as ExtractResolvable<TOptions[typeof key]>;
        }
    }

    public run<T extends {}>(input: InstructionInput<T>): TReturn {
        this.resolveOptions(input.state);
        return this.parse(input);
    }

    abstract parse<T extends {}>({ buffer, offset, parser }: InstructionInput<T>): TReturn;
}
export default ParserInstruction;