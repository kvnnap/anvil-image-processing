import { Vector4 } from "../math/Vector4";
import { BaseShader } from "./BaseShader";
import { IShaderVisitor } from "./IShaderVisitor";

export class GrayscaleShader extends BaseShader
{
    accept(visitor: IShaderVisitor): void
    {
        visitor.visitGrayscale(this);
    }

    compute(): void
    {
        let input = this.inputs[0];
        let output = this.outputs[0];
        let dim = input.getDimensions();
        output.setDimensions(dim.x, dim.y);

        for(let y = 0; y < dim.y; ++y)
        {
            for(let x = 0; x < dim.x; ++x)
            {
                let cell = input.get(x,y);
                let value = 0.299 * cell.r + 0.587 * cell.g + 0.114 * cell.b;
                output.set(x, y, new Vector4(value, value, value, 1));
            }
        }
    }
}