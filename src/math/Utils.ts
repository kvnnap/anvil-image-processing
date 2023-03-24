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
        let out: number[] = f.createComplexArray();
        f.transform(out, signal);
        return out;
    }

    export function InverseFastFourierTransfrom(signal: number[], toReal:boolean = false) : number[]
    {
        let f = new FFT(signal.length >>> 1);
        let out: number[] = f.createComplexArray();
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

    export function ExpandToPowerOfTwo<T>(n: T[], defaultValue: () => T)
    {
        const oldLen = n.length;
        const len = NextPowerOfTwo(n.length);
        n.length = len;
        for (let i = oldLen; i < len; ++i)
            n[i] = defaultValue();
    }

    export function Expand2DToPowerOfTwo(n: number[][])
    {
        const len = NextPowerOfTwo(n[0].length);
        ExpandToPowerOfTwo(n, () => Array<number>(len).fill(0));
        for (let i = 0; i < n.length; ++i)
            ExpandToPowerOfTwo(n[i], () => 0);
    }

    // input is [y][x] - [rows][cols] where n is the number of slots each element takes
    export function Transpose<T>(arr: T[][], n: number = 1): T[][] 
    {
        const rows = arr.length;
        const cols = arr[0].length;
        const rowsTimesN = rows * n;
        const transposedArr = new Array<T[]>(cols / n);
        for (let i = 0; i < transposedArr.length; i++) 
        {
            transposedArr[i] = new Array<T>(rowsTimesN);
            for (let j = 0; j < rows; j++)
            {
                for (let k = 0; k < n; k++)
                    transposedArr[i][j * n + k] = arr[j][i * n + k];
            }
        }

        return transposedArr;
    }
      
    // input is [y][x]
    export function FFT2D(signal: number[][])
    {
        Expand2DToPowerOfTwo(signal);
        let rowsTransformed = signal.map(row => Utils.FastFourierTransfrom(row));
        let colsTransformed = Transpose(rowsTransformed, 2).map(col => Utils.ComplexFastFourierTransfrom(col));
        //return Transpose(colsTransformed, 2);
        return colsTransformed;
    }

    // input is [x][y] and y is complex (hence, double size)
    export function IFFT2D(signal: number[][])
    {
        Expand2DToPowerOfTwo(signal);
        let rowsTransformed = signal.map(row => Utils.InverseFastFourierTransfrom(row));
        let colsTransformed = Transpose(rowsTransformed, 2).map(col => Utils.InverseFastFourierTransfrom(col, true));
        return colsTransformed;
    }
}