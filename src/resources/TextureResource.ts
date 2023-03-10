import { Vector2 } from "../math/Vector2";
import { Vector4 } from "../math/Vector4";
import { ITextureResource } from "./ITextureResource";

export class TextureResource implements ITextureResource
{
    private data : Uint8ClampedArray;
    private static readonly BytesPerPixel:number = 4;

    constructor(private width: number, private height: number)
    {
        this.data = new Uint8ClampedArray(width * height * TextureResource.BytesPerPixel);
    }

    getDimensions(): Vector2
    {
        return new Vector2(this.width, this.height);
    }

    // Get value
    get(x: number, y: number): Vector4
    {
        let i = this.twoToOneDim(x, y);
        let v = new Vector4(this.data[i + 0], this.data[i + 1], this.data[i + 2], this.data[i + 3]);
        return v.mulScalar(1 / 255);
    }

    getData() : Uint8ClampedArray
    {
        return this.data;
    }

    // Assuming value is [0..1]
    set(x: number, y: number, value: Vector4): void
    {
        let i = this.twoToOneDim(x, y);
        let v = value;
        v = v.mulScalar(255);
        this.data[i + 0] = v.r;
        this.data[i + 1] = v.g;
        this.data[i + 2] = v.b;
        this.data[i + 3] = v.a;
    }

    setData(data: Uint8ClampedArray, width: number, height: number)
    {
        this.data = data;
        this.width = width;
        this.height = height;
    }

    private twoToOneDim(x: number, y: number) : number
    {
        x = x < 0 ? 0 : x >= this.width ? this.width - 1 : x;
        y = y < 0 ? 0 : y >= this.height ? this.height - 1 : y;
        return TextureResource.BytesPerPixel * (this.width * y + x);
    }
}