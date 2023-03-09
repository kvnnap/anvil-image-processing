import { BlurShader } from "./BlurShader";

export interface IShaderVisitor
{
    visitBlur(s: BlurShader) : void;
}