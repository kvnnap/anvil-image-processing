import { GrayscaleShader } from '../shaders/GrayscaleShader';
import { BaseShaderProp } from './Shader';

type GrayscaleShaderProp = BaseShaderProp & { grayscaleShader: GrayscaleShader };

export function GrayscaleShaderComponent(props: GrayscaleShaderProp)
{
    return <div>
        <p>Grayscale Shader Component</p>
    </div>;
}
