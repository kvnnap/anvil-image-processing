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

        const xNext = Utils.NextPowerOfTwo(dim.x);
        const yNext = Utils.NextPowerOfTwo(dim.y);
        const xDoubleNext = Utils.NextPowerOfTwo(dim.x * 2);
        const yDoubleNext = Utils.NextPowerOfTwo(dim.y * 2); // complex so twice

        let rSignal:number[] = Array(xNext).fill(0);
        let gSignal:number[] = Array(xNext).fill(0);
        let bSignal:number[] = Array(xNext).fill(0);

        let fRowRed:number[][] = Array(dim.y);
        let fRowGreen:number[][] = Array(dim.y);
        let fRowBlue:number[][] = Array(dim.y);

        let fColRed:number[][] = Array(xNext);
        let fColGreen:number[][] = Array(xNext);
        let fColBlue:number[][] = Array(xNext);

        for (let y = 0; y < dim.y; ++y)
        {
            // Rows
            for (let x = 0; x < dim.x; ++x)
            {
                rSignal[x] = input.get(x, y).r;
                gSignal[x] = input.get(x, y).g;
                bSignal[x] = input.get(x, y).b;
            }

            fRowRed[y] = Utils.FastFourierTransfrom(rSignal);
            fRowGreen[y] = Utils.FastFourierTransfrom(gSignal);
            fRowBlue[y] = Utils.FastFourierTransfrom(bSignal);
        }

        rSignal = Array(yDoubleNext).fill(0);
        gSignal = Array(yDoubleNext).fill(0);
        bSignal = Array(yDoubleNext).fill(0);

        for (let x = 0; x < xNext; ++x)
        {
            const xTwo = x << 1;
            // Columns
            for (let y = 0; y < dim.y; ++y)
            {
                const yTwo = y << 1;
                rSignal[yTwo] = fRowRed[y][xTwo];
                gSignal[yTwo] = fRowGreen[y][xTwo];
                bSignal[yTwo] = fRowBlue[y][xTwo];
                rSignal[yTwo + 1] = fRowRed[y][xTwo + 1];
                gSignal[yTwo + 1] = fRowGreen[y][xTwo + 1];
                bSignal[yTwo + 1] = fRowBlue[y][xTwo + 1];
            }

            fColRed[x] = Utils.ComplexFastFourierTransfrom(rSignal);
            fColGreen[x] = Utils.ComplexFastFourierTransfrom(gSignal);
            fColBlue[x] = Utils.ComplexFastFourierTransfrom(bSignal);
        }

        // Do whatever processing here
        for (let y = 32; y < yDoubleNext; ++y)
        {
            for (let x = 32; x < xNext; ++x)
            {
                fColRed[x][y] = fColGreen[x][y] = fColBlue[x][y] = 0;
            }
        }


        // Revert back
        for (let x = 0; x < xNext; ++x)
        {
            fColRed[x] = Utils.InverseFastFourierTransfrom(fColRed[x]);
            fColGreen[x] = Utils.InverseFastFourierTransfrom(fColGreen[x]);
            fColBlue[x] = Utils.InverseFastFourierTransfrom(fColBlue[x]);
        }

        rSignal = Array(xDoubleNext).fill(0);
        gSignal = Array(xDoubleNext).fill(0);
        bSignal = Array(xDoubleNext).fill(0);

        for (let y = 0; y < dim.y; ++y)
        {
            const yTwo = y << 1;
            // Rows
            for (let x = 0; x < xNext; ++x)
            {
                const xTwo = x << 1;
                rSignal[xTwo] = fColRed[x][yTwo];
                gSignal[xTwo] = fColGreen[x][yTwo];
                bSignal[xTwo] = fColBlue[x][yTwo];
                rSignal[xTwo + 1] = fColRed[x][yTwo + 1];
                gSignal[xTwo + 1] = fColGreen[x][yTwo + 1];
                bSignal[xTwo + 1] = fColBlue[x][yTwo + 1];
            }

            fRowRed[y] = Utils.InverseFastFourierTransfrom(rSignal, true);
            fRowGreen[y] = Utils.InverseFastFourierTransfrom(gSignal, true);
            fRowBlue[y] = Utils.InverseFastFourierTransfrom(bSignal, true);

            // Output
            for (let x = 0; x < dim.x; ++x)
                out.set(x, y, new Vector4(fRowRed[y][x], fRowGreen[y][x], fRowBlue[y][x], 1));
        }
    }
    
}