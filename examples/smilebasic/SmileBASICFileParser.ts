import { StringTrimType } from "../../src/Instructions/String";
import Parser from "../../src/Parser";

new Parser()
    .u16("version")
    .u16("file_type", /*{
        "enum": Parser.choose("version", { 0x04: SB4FileType }, SB3FileType)
    }*/)
    .u16("zlib_compressed")
    .u16("icon", /*{
        "enum": Parser.choose("version", {
            0x04: null
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
    // .buffer("content_raw", {
    //     //end: -0x20,
    //     // process: Parser.choice("zlib_compressed", {
    //     //     0x01: Parser.Transform.Inflate
    //     // }, null)
    //     size: Infinity
    // })
    // .buffer("footer", {
    //     size: 0x20,
    //     //assert: Parser.Transform.HashesMatch("sha1", Parser.range([0, -0x20]))
    // })
    // .parse("content", {
    //     data: "content_raw",
    //     parser: Parser.choice("version", {
    //         0x04: Parser.choice("file_type", {
    //             [SB4FileType.Text]: TextParser,
    //             [SB4FileType.Data]: SB4DataParser,
    //             [SB4FileType.Project]: SB4ProjectParser,
    //             [SB4FileType.Meta]: SB4MetaParser
    //         }, Parser.choice("file_type", {
    //             [SB3FileType.Text]: TextParser,
    //             [SB3FileType.Data]: SB4DataParser,
    //             [SB3FileType.Project]: SB4ProjectParser
    //         })
    //         )
    //     })