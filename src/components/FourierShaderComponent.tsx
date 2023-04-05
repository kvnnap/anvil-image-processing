import { FourierShader } from '../shaders/FourierShader';
import { BaseShaderProp } from './Shader';

type FourierShaderProp = BaseShaderProp & { fourierShader: FourierShader };

type FourierShaderState = 
{
}

export function FourierShaderComponent(props: FourierShaderProp)
{
    return <div>
        <p>Fourier Shader Component</p>
    </div>;
}
