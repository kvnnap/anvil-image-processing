import { BlurShader } from "./BlurShader";
import { FourierShader } from "./FourierShader";
import { GrayscaleShader } from "./GrayscaleShader";
import { MaskShader } from "./MaskShader";
import { WaveletShader } from "./WaveletShader";

export interface IShaderVisitor
{
    visitBlur(s: BlurShader) : void;
    visitGrayscale(s: GrayscaleShader) : void;
    visitMask(s: MaskShader) : void;
    visitFourier(s: FourierShader) : void;
    visitWavelet(s: WaveletShader) : void;
}