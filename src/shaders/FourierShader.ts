import { Utils } from "../math/Utils";
import { Vector2 } from "../math/Vector2";
import { Vector4 } from "../math/Vector4";
import { BaseShader } from "./BaseShader";
import { IShaderVisitor } from "./IShaderVisitor";

export class FourierShader extends BaseShader
{
    private computingInverse:boolean = false;

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

    computeFFT()
    {
        let input = this.inputs[0];
        let outMag = this.outputs[0];
        let outPhase = this.outputs[1];
        let dim = input.getDimensions();

        let r = Array<number[]>(dim.y);

        for (let y = 0; y < dim.y; ++y)
        {
            r[y] = Array<number>(dim.x);
            for (let x = 0; x < dim.x; ++x)
                r[y][x] = input.get(x,y).r;
        }

        let fColRed = Utils.FFT2D(r);

        // Convert to standard freq diagram
        fColRed = FourierShader.Shift1DFourier(fColRed);
        for (let x = 0; x < fColRed.length; ++x)
        {
            let col = FourierShader.Shift1DFourier(FourierShader.ComplexToVector(fColRed[x]));
            for(let y = 0; y < col.length; ++y)
            {
                let mag = Math.sqrt(col[y].x * col[y].x + col[y].y * col[y].y);
                let phase = Math.atan2(col[y].y, col[y].x);
                outMag.set(x, y, new Vector4(mag, mag, mag, 1));
                outPhase.set(x, y, new Vector4(phase, phase, phase, 1));
            }
        }
    }

    computeIFFT()
    {
        let mag = this.inputs[0];
        let phase = this.inputs[1];

        let out = this.outputs[0];
        let dim = mag.getDimensions();

        let fColRedVec = Array<Vector2[]>(dim.x);
        let fColRed = Array<number[]>(dim.x);
        for(let x = 0; x < dim.x; ++x)
        {
            fColRedVec[x] = Array<Vector2>(dim.y);
            for (let y = 0; y < dim.y; ++y)
            {
                let theta = phase.get(x,y).r;
                let r = mag.get(x,y).r;
                let v  = new Vector2();
                v.x =  r * Math.cos(theta);
                v.y =  r * Math.sin(theta);
                fColRedVec[x][y] = v;
            }
            fColRed[x] = FourierShader.VectorToComplex(FourierShader.Shift1DFourier(fColRedVec[x], true));
        }
        fColRed = FourierShader.Shift1DFourier(fColRed, true);

        let r = Utils.IFFT2D(fColRed);
        for (let y = 0; y < dim.y; ++y)
            for (let x = 0; x < dim.x; ++x)
                out.set(x, y, new Vector4(r[y][x], r[y][x], r[y][x], 1));
    }

    setMode(computingInverse: boolean)
    {
        this.computingInverse = computingInverse;
    }

    compute(): void 
    {
        return this.computingInverse ? this.computeIFFT() : this.computeFFT();
    }
 
    getMode() {
        return this.computingInverse;
    }
}