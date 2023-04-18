import { BaseShaderProp } from './Shader';
import { WaveletShader } from '../shaders/WaveletShader';

type WaveletShaderProp = BaseShaderProp & { waveletShader: WaveletShader };

type WaveletShaderState = 
{
    computeInverse: boolean
}

export function WaveletShaderComponent(props: WaveletShaderProp)
{
    return <div>
        <span>Wavelet Shader Component</span>
    </div>;
}
