import { BlurShader } from "./BlurShader";
import { FourierShader } from "./FourierShader";
import { GrayscaleShader } from "./GrayscaleShader";
import { MaskShader } from "./MaskShader";

export interface IShaderVisitor
{
    visitBlur(s: BlurShader) : void;
    visitGrayscale(s: GrayscaleShader) : void;
    visitMask(s: MaskShader) : void;
    visitFourier(s: FourierShader) : void;
}