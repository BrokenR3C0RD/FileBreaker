import Parser from "../src/Parser";

const x = new Parser()
    .u8("test")
    .u16("test2");


const returned = x.parse(Buffer.from([ 0x01, 0x02, 0x04 ]));
console.log(returned);