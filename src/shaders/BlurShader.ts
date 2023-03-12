import { Utils } from "../math/Utils";
import { Vector2 } from "../math/Vector2";
import { Vector4 } from "../math/Vector4";
import { ITextureResource } from "../resources/ITextureResource";
import { TextureResource } from "../resources/TextureResource";
import { IShader } from "./IShader";
import { IShaderVisitor } from "./IShaderVisitor";

export class BlurShader implements IShader
{
    private static stdDeviations: number = 3;
    
    private inputs: ITextureResource[] = [];
    private outputs: ITextureResource[] = [];

    private filterCoeff:number[] = [];

    getInputs(): ITextureResource[]
    {
        return this.inputs;
    }

    getOutputs(): ITextureResource[]
    {
        throw this.outputs;
    }

    getFilterSize() : number 
    {
        return this.filterCoeff.length;
    }

    setInputs(inputs: ITextureResource[]): void
    {
        this.inputs = inputs;
    }

    setOutputs(outputs: ITextureResource[]): void
    {
        this.outputs = outputs;
    }

    setFilterSize(size: number)
    {
        if (size % 2 == 0)
		    ++size;
        this.filterCoeff = new Array<number>(size);

        const halfFilterSize = 0.5 * size;
        const stdDev = halfFilterSize / BlurShader.stdDeviations;
        let f = -halfFilterSize;

        const invTotalIntegral = 1 / Utils.GaussianIntegral(-halfFilterSize, halfFilterSize, stdDev);
        for (let i = 0; i < size; ++i, ++f)
            this.filterCoeff[i] = Utils.GaussianIntegral(f, f + 1, stdDev) * invTotalIntegral;
    }

    compute(): void
    {
        // 2-pass approach
        let filterSize = this.filterCoeff.length;
        let halfSize = filterSize >> 1;

        let result = new Vector4();

        let input = this.inputs[0];
        let output = this.outputs[0];
        let dimInput = input.getDimensions();
        let dimOutput = output.getDimensions();
        let dim = new Vector2(
            dimInput.x < dimOutput.x ? dimInput.x : dimOutput.x,
            dimInput.y < dimOutput.y ? dimInput.y : dimOutput.y,
        );

        let buffer = new TextureResource(dim.x, dim.y);

        // first pass
        for(let y = 0; y < dim.y; ++y)
        {
            for(let x = 0; x < dim.x; ++x)
            {
                result = new Vector4();
                for (let i = 0; i < filterSize; ++i)
                    result.addSelf(input.get(x + i - halfSize, y).mulScalar(this.filterCoeff[i]));
                buffer.set(x, y, result);
            }
        }

        // second pass
        for(let y = 0; y < dim.y; ++y)
        {
            for(let x = 0; x < dim.x; ++x)
            {
                result = new Vector4();
                for (let i = 0; i < filterSize; ++i)
                    result.addSelf(buffer.get(x, y + i - halfSize).mulScalar(this.filterCoeff[i]));
                output.set(x, y, result);
            }
        }
    }

    accept(visitor: IShaderVisitor): void 
    {
        visitor.visitBlur(this);
    }
}