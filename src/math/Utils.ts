import { create, erfDependencies } from 'mathjs'
//import { erf } from 'mathjs'
import { constants } from './Constants'
export namespace Utils
{
    const { erf } = create({erfDependencies});

    export function GaussianIntegral(a:number, b:number, stdDev: number) : number 
    {
        const den = 1 / (stdDev * constants.SqrtTwo);
        return 0.5 * (erf(b * den) - erf(a * den));
    }
}