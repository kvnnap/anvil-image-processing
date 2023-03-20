import { create, erfDependencies } from 'mathjs'
import FFT from 'fft.js';
import { constants } from './Constants'
export namespace Utils
{
    const { erf } = create({erfDependencies});

    export function GaussianIntegral(a:number, b:number, stdDev: number) : number 
    {
        const den = 1 / (stdDev * constants.SqrtTwo);
        return 0.5 * (erf(b * den) - erf(a * den));
    }

    export function FastFourierTransfrom(signal: number[])
    {
        let f = new FFT(signal.length);
        let out: number[] = f.createComplexArray();
        f.realTransform(out, signal);
        f.completeSpectrum(out);
        return out;
    }

    export function ComplexFastFourierTransfrom(signal: number[])
    {
        let f = new FFT(signal.length >>> 1);
        let out = f.createComplexArray();
        f.transform(out, signal);
        return out;
    }

    export function InverseFastFourierTransfrom(signal: number[], toReal:boolean = false)
    {
        let f = new FFT(signal.length >>> 1);
        let out = f.createComplexArray();
        f.inverseTransform(out, signal);
        return toReal ? f.fromComplexArray(out, null) : out;
    }

    export function NextPowerOfTwo(n: number)
    {
        --n;
        n |= n >> 1;
        n |= n >> 2;
        n |= n >> 4;
        n |= n >> 8;
        n |= n >> 16;
        return ++n;
    }
}