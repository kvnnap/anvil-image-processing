// Shader has access to n input resources and m output resources

import { ITextureResource } from "../resources/ITextureResource";

export interface IShader
{
    getInputs() : ITextureResource[];
    getOutputs() : ITextureResource[];
    setInputs(inputs: ITextureResource[]) : void;
    setOutputs(outputs: ITextureResource[]) : void;
    
    compute() : void;
}
