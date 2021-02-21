import { Transformer } from "../types";
import { inflateSync } from "zlib";

const Inflate: Transformer<Buffer> =
{
    transform: (input) => inflateSync(input)
}

export default Inflate;