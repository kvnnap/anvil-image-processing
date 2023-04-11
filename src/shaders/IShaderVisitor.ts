import { BlurShader } from "./BlurShader";
import { FourierShader } from "./FourierShader";
import { GrayscaleShader } from "./GrayscaleShader";

export interface IShaderVisitor
{
    visitBlur(s: BlurShader) : void;
    visitGrayscale(s: GrayscaleShader) : void;
    visitFourier(s: FourierShader) : void;
}