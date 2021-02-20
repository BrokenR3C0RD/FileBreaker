import Parser from "../src/Parser";
import IntegerInstruction from "../src/Instructions/Integer";

const x = new Parser()
    .u8("test");

const returned = x.parse(Buffer.from([0x01]));
console.log(returned);