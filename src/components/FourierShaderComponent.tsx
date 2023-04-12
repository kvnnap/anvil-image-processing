import { useEffect, useState } from 'react';
import { FourierShader } from '../shaders/FourierShader';
import { BaseShaderProp } from './Shader';

type FourierShaderProp = BaseShaderProp & { fourierShader: FourierShader };

type FourierShaderState = 
{
    computeInverse: boolean
}

export function FourierShaderComponent(props: FourierShaderProp)
{
    let [state, setState] = useState<FourierShaderState>(() => ({ computeInverse: props.fourierShader.getMode()}));

    useEffect(()=>{
        props.fourierShader.setMode(state.computeInverse);
    }, [state]);

    function onChange(){
        setState(p => ({computeInverse: !p.computeInverse}));
    }

    return <div>
        <span>Fourier Shader Component</span>
        <input type="checkbox" checked={state.computeInverse} onChange={onChange}></input><span>Inverse</span>
    </div>;
}
