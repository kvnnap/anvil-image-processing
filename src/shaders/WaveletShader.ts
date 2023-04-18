import { BaseShader } from "./BaseShader";
import { IShaderVisitor } from "./IShaderVisitor";
import wt from "discrete-wavelets";

export class WaveletShader extends BaseShader
{
    accept(visitor: IShaderVisitor): void 
    {
        visitor.visitWavelet(this);
    }
    compute(): void 
    {
        let input = this.inputs[0];
        let dim = input.getDimensions();
        let rowResult: number[][][] = [];
        let r = Array<number[]>(dim.y);
        for (let y = 0; y < dim.y; ++y)
        {
            r[y] = Array<number>(dim.x);
            for (let x = 0; x < dim.x; ++x)
                r[y][x] = input.get(x,y).r;
            rowResult.push(wt.dwt(r[y], 'haar'));
        }

        return;
    }
    
}