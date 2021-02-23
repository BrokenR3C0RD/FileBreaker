import { StringTrimType } from "../../src/Instructions/String";
import Parser from "../../src/Parser";
import { writeFileSync, readFileSync } from "fs";
import { performance } from "perf_hooks";
import { ExtractParserType } from "../../src/types";

enum SB3FileType {
    Text = 0,
    Data = 1,
    Project = 2
}

enum SB4FileType {
    Text = 0,
    Data = 1,
    Graphic = 2,
    Project = 3,
    Meta = 4
}

enum SB3TxtIcon {
    TXT = 0,
    PRG = 1
}

enum SB3DatIcon {
    DAT = 0,
    GRP = 2
}

enum DataType {
    Color = 0x03,
    Int32 = 0x04,
    Float64 = 0x05
}

const TextParser = new Parser()
    .string("text");

const DataParser = new Parser()
    .string("magic", { size: 8 })
    .u16("data_type")
    .u16("dim_count")
    .array("dimensions", {
        dimensions: (state) => [state["dim_count"]],
        type: "u32"
    })
    .move(0x1C)
    .array("data", {
        dimensions: Parser.pick("dimensions"),
        type: Parser.choose("data_type", {
            [DataType.Color]: "u16",
            [DataType.Int32]: "i32",
            [DataType.Float64]: "f64"
        })
    });


const SmileBASICFileParser = new Parser()
    .u16("version")
    .u16("file_type", /*{
        "enum": Parser.choose("version", { 0x04: SB4FileType }, SB3FileType)
    }*/)
    .u16("zlib_compressed")
    .u16("icon", /*{
        "enum": Parser.choose("version", {
            0x04: undefined
        }, Parser.choose("file_type", {
            [SB3FileType.Text]: SB3TxtIcon,
            [SB3FileType.Data]: SB3DatIcon
        }, null)
	}*/)
    .u32("size")
    .u16("update_year")
    .u8("update_month")
    .u8("update_day")
    .u8("update_hour")
    .u8("update_minute")
    .u8("update_second")
    .u8("unknown_0x13")
    .string("author1_name", {
        size: Parser.choose("version", { 0x04: 32 }, 18),
        trim: StringTrimType.AfterNull
    })
    .string("author2_name", {
        size: Parser.choose("version", { 0x04: 32 }, 18),
        trim: StringTrimType.AfterNull
    })
    .u32("author1_id")
    .u32("author2_id")
    .move(Parser.choose("version", { 0x04: 0x70 }, 0x50))
    .buffer("content_raw", {
        end: -20,
        transform: Parser.choose("zlib_compressed", {
            0x01: Parser.Transform.Inflate
        }, undefined)
    })
    .buffer("footer", {
        size: 20,
        //assert: Parser.Transform.HashesMatch("sha1", Parser.range([0, -0x20]))
    })
    .next("content", {
        data: "content_raw",
        parser: Parser.choose("version", {
            0x04: Parser.choose<typeof TextParser | typeof DataParser>("file_type", {
                [SB4FileType.Data]: DataParser,
                [SB4FileType.Text]: TextParser,
                // [SB4FileType.Project]: SB4ProjectParser,
                // [SB4FileType.Meta]: SB4MetaParser
            })
        }, Parser.choose<typeof TextParser | typeof DataParser>("file_type", {
            [SB4FileType.Data]: DataParser,
            [SB3FileType.Text]: TextParser,
            // [SB3FileType.Project]: SB4ProjectParser
        })) as typeof TextParser | typeof DataParser
    });
let start = performance.now()

const file = SmileBASICFileParser.parse(readFileSync(__dirname + "/TMG_DOG"));
let end = performance.now();
console.log(`parse took ${end - start}s`)

writeFileSync(__dirname + "/data.json", JSON.stringify(file, null, "  "));
