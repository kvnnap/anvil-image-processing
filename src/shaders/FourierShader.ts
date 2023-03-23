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

        let r = Array<number[]>(dim.y);
        let g = Array<number[]>(dim.y);
        let b = Array<number[]>(dim.y);

        for (let y = 0; y < dim.y; ++y)
        {
            r[y] = Array<number>(dim.x);
            g[y] = Array<number>(dim.x);
            b[y] = Array<number>(dim.x);
            for (let x = 0; x < dim.x; ++x)
            {
                r[y][x] = input.get(x,y).r;
                g[y][x] = input.get(x,y).g;
                b[y][x] = input.get(x,y).b;
            }
        }

        let fColRed = Utils.FFT2D(r);
        let fColGreen = Utils.FFT2D(g);
        let fColBlue = Utils.FFT2D(b);

        // Convert to standard freq diagram
        fColRed = FourierShader.Shift1DFourier(fColRed);
        fColGreen = FourierShader.Shift1DFourier(fColGreen);
        fColBlue = FourierShader.Shift1DFourier(fColBlue);
        for (let x = 0; x < fColRed.length; ++x)
        {
            fColRed[x]   = FourierShader.VectorToComplex(FourierShader.Shift1DFourier(FourierShader.ComplexToVector(fColRed[x])));
            fColGreen[x] = FourierShader.VectorToComplex(FourierShader.Shift1DFourier(FourierShader.ComplexToVector(fColGreen[x])));
            fColBlue[x]  = FourierShader.VectorToComplex(FourierShader.Shift1DFourier(FourierShader.ComplexToVector(fColBlue[x])));
        }

        // Do stuff here
        for (let x = 0; x < fColRed.length; ++x)
        {
            for (let y = 0; y < fColRed[x].length; ++y)
            {
                const xFil = 20;
                const yFil = 2*xFil;
                const halfWidth = (fColRed.length >>> 1) - 1;
                const halfHeight = (fColRed[x].length >>> 1) - 2;
                if (x < (halfWidth - xFil) || x > (halfWidth + xFil) || y < (halfHeight - yFil) || y > (halfHeight + yFil + 1))
                    fColRed[x][y] = fColGreen[x][y] = fColBlue[x][y] = 0;
                // if (((x > xFil && x < (fColRed.length - xFil)) || (y > yFil && y < (fColRed[x].length - yFil))))
                //     fColRed[x][y] = fColGreen[x][y] = fColBlue[x][y] = 0;
            }
        }

        // Convert from standard freq diagram
        for (let x = 0; x < fColRed.length; ++x)
        {
            fColRed[x]   = FourierShader.VectorToComplex(FourierShader.Shift1DFourier(FourierShader.ComplexToVector(fColRed[x]), true));
            fColGreen[x] = FourierShader.VectorToComplex(FourierShader.Shift1DFourier(FourierShader.ComplexToVector(fColGreen[x]), true));
            fColBlue[x]  = FourierShader.VectorToComplex(FourierShader.Shift1DFourier(FourierShader.ComplexToVector(fColBlue[x]), true));
        }
        fColRed = FourierShader.Shift1DFourier(fColRed, true);
        fColGreen = FourierShader.Shift1DFourier(fColGreen, true);
        fColBlue = FourierShader.Shift1DFourier(fColBlue, true);

        r = Utils.IFFT2D(fColRed);
        g = Utils.IFFT2D(fColGreen);
        b = Utils.IFFT2D(fColBlue);

        for (let y = 0; y < dim.y; ++y)
            for (let x = 0; x < dim.x; ++x)
                out.set(x, y, new Vector4(r[y][x], g[y][x], b[y][x], 1));
    }
    
}