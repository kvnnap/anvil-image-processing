import { Vector2 } from "../math/Vector2";
import { Vector4 } from "../math/Vector4";
import { IResource } from "./IResource";

export interface ITextureResource extends IResource
{
    getDimensions() : Vector2 ;
    setDimensions(w: number, h: number) : void ;
    get(x: number, y: number): Vector4;
    set(x: number, y: number, value: Vector4): void;
}
