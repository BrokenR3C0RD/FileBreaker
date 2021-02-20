import { Transform } from "../types";

import { inflateSync } from "zlib";

const Inflate: Transform<Buffer> = (input) => {
    return inflateSync(input);
}