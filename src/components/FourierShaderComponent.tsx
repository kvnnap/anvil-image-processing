import { ResourceManagerPropItem } from './ResourceManager';
import { FourierShader } from '../shaders/FourierShader';

type FourierShaderProp = 
{
    fourierShader: FourierShader,
    resources: ResourceManagerPropItem[],
    onChange: VoidFunction
}

type FourierShaderState = 
{
}

export function FourierShaderComponent(props: FourierShaderProp)
{
    return <div>
        <p>Fourier Shader Component</p>
    </div>;
}
