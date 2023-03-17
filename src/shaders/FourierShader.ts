import { Utils } from "../math/Utils";
import { Vector4 } from "../math/Vector4";
import { BaseShader } from "./BaseShader";
import { IShaderVisitor } from "./IShaderVisitor";

export class FourierShader extends BaseShader
{
    accept(visitor: IShaderVisitor): void
    {
        visitor.visitFourier(this);
    }

    compute(): void 
    {
        let input = this.inputs[0];
        let out = this.outputs[0];
        let dim = input.getDimensions();
        for (let y = 0; y < dim.y; ++y)
        {
            // Rows
            let rSignal:number[] = [];
            let gSignal:number[] = [];
            let bSignal:number[] = [];
            for (let x = 0; x < dim.x; ++x)
            {
                rSignal.push(input.get(x, y).r);
                gSignal.push(input.get(x, y).g);
                bSignal.push(input.get(x, y).b);
            }

            let res = Utils.FFT(gSignal);
            let res2 = Utils.IFFT(res);
            
            for (let x = 0; x < dim.x; ++x)
            {
                out.set(x, y, new Vector4(0, res2[x], 0, 1));
            }
        }
    }
    
}