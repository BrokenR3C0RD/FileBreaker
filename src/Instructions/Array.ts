import ndarray from "ndarray";
import { InstructionInput, ParserInstruction } from "../Parser";
import { TypedArray, ValidArrayType } from "../types";

export type ArrayInstructionOptions = {
    dimensions: number[] | ndarray<number>
    type: ValidArrayType
}

class ArrayInstruction<TKey extends string = ""> extends ParserInstruction<TKey, ArrayInstructionOptions, ndarray<number>>{
    parse<T>({ buffer, offset }: InstructionInput<T>) {
        const options = this.resolvedOptions;
        const byteOffset = buffer.byteOffset + offset.value;
        let backingArray: TypedArray;

        const dims = options.dimensions!;
        let dimensions: number[];
        if ("data" in dims) {
            dimensions = Array.prototype.slice.call(dims.data);
        } else {
            dimensions = dims;
        }

        const sizeInElements = dimensions.reduce((acc, dim) => acc = acc * dim);
        switch (options.type) {
            case "u8":
                backingArray = new Uint8Array(buffer.buffer, byteOffset, sizeInElements);
                break;
            case "u16":
                backingArray = new Uint16Array(buffer.buffer, byteOffset, sizeInElements * 2);
                break;
            case "u32":
                backingArray = new Uint32Array(buffer.buffer, byteOffset, sizeInElements * 4);
                break;
            case "i8":
                backingArray = new Int8Array(buffer.buffer, byteOffset, sizeInElements);
                break;
            case "i16":
                backingArray = new Int16Array(buffer.buffer, byteOffset, sizeInElements * 2);
                break;
            case "i32":
                backingArray = new Int32Array(buffer.buffer, byteOffset, sizeInElements * 4);
                break;
            case "f32":
                backingArray = new Float32Array(buffer.buffer, byteOffset, sizeInElements * 4);
                break;
            case "f64":
                backingArray = new Float64Array(buffer.buffer, byteOffset, sizeInElements * 8);
                break;
            default:
                throw new TypeError(`type ${options.type} is invalid`);
        }
        offset.value += sizeInElements * backingArray.BYTES_PER_ELEMENT;
        return ndarray(backingArray, dimensions!);
    }
}

export default ArrayInstruction;