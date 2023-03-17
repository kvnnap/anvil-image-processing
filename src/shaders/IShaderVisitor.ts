import { BlurShader } from "./BlurShader";
import { FourierShader } from "./FourierShader";

export interface IShaderVisitor
{
    visitBlur(s: BlurShader) : void;
    visitFourier(s: FourierShader) : void;
}