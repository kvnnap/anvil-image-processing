import { create, erfDependencies, sign } from 'mathjs'
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

    // input is [y][x]
    export function FFT2D(signal: number[][])
    {
        const width = NextPowerOfTwo(signal[0].length);
        const height = NextPowerOfTwo(signal.length);
        const twiceHeight = height << 1;
        
        let tempRow = Array<number[]>(signal.length);

        let tempSignal = Array(width).fill(0);

        // FFT on Rows
        for (let y = 0; y < signal.length; ++y)
        {
            let s = signal[y];
            for (let x = 0; x < s.length; ++x)
                tempSignal[x] = s[x];
            tempRow[y] = FastFourierTransfrom(tempSignal);
        }

        // FFT on columns
        tempSignal = Array(twiceHeight).fill(0);
        let outCol = Array(width);

        for (let x = 0; x < width; ++x)
        {
            const xTwo = x << 1;
            for (let y = 0; y < signal.length; ++y)
            {
                const yTwo = y << 1;
                tempSignal[yTwo] = tempRow[y][xTwo];
                tempSignal[yTwo + 1] = tempRow[y][xTwo + 1];
            }
            outCol[x] = ComplexFastFourierTransfrom(tempSignal);
        }

        return outCol;
    }

    // input is [x][y] and y is complex (hence, double size)
    export function IFFT2D(signal: number[][])
    {
        const width = NextPowerOfTwo(signal.length);
        const height = NextPowerOfTwo(signal[0].length); // Is complex
        const twiceWidth = width << 1;

        let tempCol = Array<number[]>(width);
        let tempSignal = Array<number>(height).fill(0);

        // Inverse FFT on columns
        for(let x = 0; x < signal.length; ++x)
        {
            let s = signal[x];
            let dest: number[];
            if (s.length === height)
            {
                dest = s;
            } else 
            {
                for (let y = 0; y < s.length; ++y)
                    tempSignal[y] = s[y];
                dest = tempSignal;
            }
            tempCol[x] = InverseFastFourierTransfrom(dest);
        }

        tempSignal = Array<number>(twiceWidth).fill(0);
        let outRow = Array(height);

        for (let y = 0; y < height; ++y)
        {
            const yTwo = y << 1;
            for(let x = 0; x < width; ++x)
            {
                const xTwo = x << 1;
                tempSignal[xTwo] = tempCol[x][yTwo];
                tempSignal[xTwo + 1] = tempCol[x][yTwo + 1];
            }

            outRow[y] = InverseFastFourierTransfrom(tempSignal, true);
        }

        return outRow;
    }

    // input is [x][y] and y is complex (hence, double size)
    export function IFFT2DOther(signal: number[][])
    {
        let rowSignal = Array<number[]>(signal[0].length >>> 1);

        // Convert columns to row notation
        for (let x = 0; x < signal.length; ++x)
        {
            const xTwo = x << 1;
            for(let y = 0; y < signal[0].length >>> 1; ++y)
            {
                if (rowSignal[y] === undefined)
                    rowSignal[y] = [];
                const yTwo = y << 1;
                rowSignal[y][xTwo] = signal[x][yTwo];
                rowSignal[y][xTwo + 1] = signal[x][yTwo + 1];
            }
        }
        
        signal = rowSignal; // signal is now [y][x] and x is complex

        const width = NextPowerOfTwo(signal[0].length >>> 1);
        const height = NextPowerOfTwo(signal.length); // Is complex
        const twiceWidth = width << 1;
        const twiceHeight = height << 1;
        let tempSignal = Array(twiceWidth).fill(0);
        let tempRow = Array<number[]>(signal.length);

         // IFFT on Rows
         for (let y = 0; y < signal.length; ++y)
         {
             let s = signal[y];
             for (let x = 0; x < s.length; ++x)
                 tempSignal[x] = s[x];
             tempRow[y] = InverseFastFourierTransfrom(tempSignal);
         }

         // IFFT on columns
        tempSignal = Array(twiceHeight).fill(0);
        let outCol = Array(width);

        for (let x = 0; x < width; ++x)
        {
            const xTwo = x << 1;
            for (let y = 0; y < signal.length; ++y)
            {
                const yTwo = y << 1;
                tempSignal[yTwo] = tempRow[y][xTwo];
                tempSignal[yTwo + 1] = tempRow[y][xTwo + 1];
            }
            outCol[x] = InverseFastFourierTransfrom(tempSignal, true);
        }

        return outCol;
    }
}