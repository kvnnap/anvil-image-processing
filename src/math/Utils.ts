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
        // let out = f.createComplexArray();
        // let a:number[] = f.toComplexArray(signal, null);
        // f.transform(out, a);
        let out: number[] = [];
        f.realTransform(out, signal);
        f.completeSpectrum(out);
        return out;
    }

    export function InverseFastFourierTransfrom(signal: number[])
    {
        let f = new FFT(signal.length >>> 1);
        let out = f.createComplexArray();
        f.inverseTransform(out, signal);
        return f.fromComplexArray(out, null);
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