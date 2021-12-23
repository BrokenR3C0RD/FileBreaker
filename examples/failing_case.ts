import Parser from "../src/Parser";

let first_parser = new Parser()
    .string("test1");

let second_parser = new Parser()
    .string("test2");

let broken_parser = new Parser()
    .u8("switch")
    .next("bad", Parser.choose("switch", {
        0x0: first_parser,
        0x1: second_parser
    }));
