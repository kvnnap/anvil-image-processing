import { MaskShader } from '../shaders/MaskShader';
import { BaseShaderProp } from './Shader';

type MaskShaderProp = BaseShaderProp & { maskShader: MaskShader };

export function MaskShaderComponent(props: MaskShaderProp)
{
    return <div>
        <p>Mask Shader Component</p>
    </div>;
}
