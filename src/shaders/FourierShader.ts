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
        let rSignal:number[] = Array(Utils.NextPowerOfTwo(dim.x)).fill(0);
        let gSignal:number[] = Array(Utils.NextPowerOfTwo(dim.x)).fill(0);
        let bSignal:number[] = Array(Utils.NextPowerOfTwo(dim.x)).fill(0);

        for (let y = 0; y < dim.y; ++y)
        {
            // Rows
            for (let x = 0; x < dim.x; ++x)
            {
                rSignal[x] = input.get(x, y).r;
                gSignal[x] = input.get(x, y).g;
                bSignal[x] = input.get(x, y).b;
            }

            let freqRed = Utils.FastFourierTransfrom(rSignal);
            let freqGreen = Utils.FastFourierTransfrom(gSignal);
            let freqBlue = Utils.FastFourierTransfrom(bSignal);

            let red = Utils.InverseFastFourierTransfrom(freqRed);
            let green = Utils.InverseFastFourierTransfrom(freqGreen);
            let blue = Utils.InverseFastFourierTransfrom(freqBlue);
            
            for (let x = 0; x < dim.x; ++x)
                out.set(x, y, new Vector4(red[x], green[x], blue[x], 1));
        }
    }
    
}