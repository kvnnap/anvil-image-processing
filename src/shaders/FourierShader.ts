import { Utils } from "../math/Utils";
import { Vector2 } from "../math/Vector2";
import { Vector4 } from "../math/Vector4";
import { BaseShader } from "./BaseShader";
import { IShaderVisitor } from "./IShaderVisitor";

export class FourierShader extends BaseShader
{
    accept(visitor: IShaderVisitor): void
    {
        visitor.visitFourier(this);
    }

    static Shift1DFourier<T>(list:T[], inverse: boolean = false)
    {
        const mid = (list.length >>> 1) + (inverse ? -1 : 1);
        let a = list.slice(mid);
        let b = list.slice(0, mid);
        let r = inverse ? b : a;
        r.reverse();
        return a.concat(b);
    }

    static ComplexToVector(list:number[])
    {
        let ret = Array<Vector2>(list.length >>> 1);
        for (let i = 0; i < list.length; i += 2)
            ret[i >>> 1] = new Vector2(list[i], list[i + 1]);
        return ret;
    }

    static VectorToComplex(list: Vector2[])
    {
        let ret = Array<number>(list.length << 1);
        for (let i = 0; i < list.length; ++i)
        {
            const twoX = i << 1;
            ret[twoX] = list[i].x;
            ret[twoX + 1] = list[i].y;
        }
        return ret;
    }

    compute(): void 
    {
        let input = this.inputs[0];
        let out = this.outputs[0];
        let dim = input.getDimensions();

        const xNext = Utils.NextPowerOfTwo(dim.x);
        const yNext = Utils.NextPowerOfTwo(dim.y);
        const xDoubleNext = Utils.NextPowerOfTwo(dim.x << 1);
        const yDoubleNext = Utils.NextPowerOfTwo(dim.y << 1); // complex so twice

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

        // Convert to standard freq diagram
        fColRed = FourierShader.Shift1DFourier(fColRed);
        fColGreen = FourierShader.Shift1DFourier(fColGreen);
        fColBlue = FourierShader.Shift1DFourier(fColBlue);
        for (let x = 0; x < xNext; ++x)
        {
            fColRed[x]   = FourierShader.VectorToComplex(FourierShader.Shift1DFourier(FourierShader.ComplexToVector(fColRed[x])));
            fColGreen[x] = FourierShader.VectorToComplex(FourierShader.Shift1DFourier(FourierShader.ComplexToVector(fColGreen[x])));
            fColBlue[x]  = FourierShader.VectorToComplex(FourierShader.Shift1DFourier(FourierShader.ComplexToVector(fColBlue[x])));
        }

        // Do stuff here

        // Convert from standard freq diagram
        for (let x = 0; x < xNext; ++x)
        {
            fColRed[x]   = FourierShader.VectorToComplex(FourierShader.Shift1DFourier(FourierShader.ComplexToVector(fColRed[x]), true));
            fColGreen[x] = FourierShader.VectorToComplex(FourierShader.Shift1DFourier(FourierShader.ComplexToVector(fColGreen[x]), true));
            fColBlue[x]  = FourierShader.VectorToComplex(FourierShader.Shift1DFourier(FourierShader.ComplexToVector(fColBlue[x]), true));
        }
        fColRed = FourierShader.Shift1DFourier(fColRed, true);
        fColGreen = FourierShader.Shift1DFourier(fColGreen, true);
        fColBlue = FourierShader.Shift1DFourier(fColBlue, true);

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