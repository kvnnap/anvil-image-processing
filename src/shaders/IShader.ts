// Shader has access to n input resources and m output resources

import { ITextureResource } from "../resources/ITextureResource";
import { IShaderVisitor } from "./IShaderVisitor";

export interface IShader
{
    getInputs() : ITextureResource[];
    getOutputs() : ITextureResource[];
    setInputs(inputs: ITextureResource[]) : void;
    setOutputs(outputs: ITextureResource[]) : void;
    
    accept(visitor: IShaderVisitor) : void;
    compute() : void;
}
