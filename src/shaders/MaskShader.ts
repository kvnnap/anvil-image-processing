import { Vector2 } from "../math/Vector2";
import { Vector4 } from "../math/Vector4";
import { BaseShader } from "./BaseShader";
import { IShaderVisitor } from "./IShaderVisitor";

export class MaskShader extends BaseShader
{
    accept(visitor: IShaderVisitor): void
    {
        visitor.visitMask(this);
    }

    compute(): void
    {
        let input = this.inputs[0]; // data
        let mask = this.inputs[1]; // data
        let output = this.outputs[0];
        let dim = input.getDimensions();
        let maskDim = mask.getDimensions();
        output.setDimensions(dim.x, dim.y);

        const ratioDim = new Vector2(maskDim.x / dim.x, maskDim.y / dim.y);

        for(let y = 0; y < dim.y; ++y)
        {
            for(let x = 0; x < dim.x; ++x)
            {

                let cell = input.get(x,y);
                let maskValue = mask.get(Math.floor(x * ratioDim.x), Math.floor(y * ratioDim.y));
                let value = cell.mul(maskValue);
                output.set(x, y, new Vector4(value.r, value.g, value.b, 1));
            }
        }
    }
}