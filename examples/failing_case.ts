import Parser from "../src/Parser";

let first_parser = new Parser()
    .string("test1");

let second_parser = new Parser()
    .string("test2");

let broken_parser = new Parser()
    .u8("switch")
    .next("bad", {
        parser: Parser.choose("switch", {
            0x0: first_parser,
            /*
            Type 'Parser<{ test2: string; }>' is not assignable to type 'Resolvable<Parser<{ test1: string; }>>'.
              Type 'Parser<{ test2: string; }>' is not assignable to type 'Parser<{ test1: string; }>'.
                Property 'test1' is missing in type '{ test2: string; }' but required in type '{ test1: string; }'.
             */
            0x1: second_parser
        })
    });
