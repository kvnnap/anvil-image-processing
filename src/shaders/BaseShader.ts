import { ITextureResource } from "../resources/ITextureResource";
import { IShader } from "./IShader";
import { IShaderVisitor } from "./IShaderVisitor";

export abstract class BaseShader implements IShader
{
    protected inputs: ITextureResource[] = [];
    protected outputs: ITextureResource[] = [];

    getInputs(): ITextureResource[] { return this.inputs; }
    getOutputs(): ITextureResource[] { return this.outputs; }
    setInputs(inputs: ITextureResource[]): void { this.inputs = inputs; }
    setOutputs(outputs: ITextureResource[]): void { this.outputs = outputs; }

    abstract accept(visitor: IShaderVisitor): void;
    abstract compute(): void;
}
