import { Vector2 } from "../math/Vector2";
import { Vector4 } from "../math/Vector4";
import { ITextureResource } from "./ITextureResource";

export class TextureResource implements ITextureResource
{
    data : Uint8ClampedArray;

    constructor(private width: number, private height: number)
    {
        this.data = new Uint8ClampedArray(width * height * 4);
    }

    getDimensions(): Vector2
    {
        return new Vector2(this.width, this.height);
    }

    // Get value
    get(x: number, y: number): Vector4
    {
        let i = this.twoToOneDim(x, y);
        let v = new Vector4(this.data[i + 0], this.data[i + i], this.data[i + 2], this.data[i + 3]);
        return v.mulScalar(1 / 255);
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

    private twoToOneDim(x: number, y: number) : number
    {
        return this.height * y + x;
    }
}