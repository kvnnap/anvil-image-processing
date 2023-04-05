import React, { useState } from 'react';
import { BlurShader } from '../shaders/BlurShader';
import { BaseShaderProp } from './Shader';

type BlurShaderProp = BaseShaderProp & { blurShader: BlurShader };

type BlurShaderState = 
{
    filterSize: number
}

export function BlurShaderComponent(props: BlurShaderProp)
{
    let [state, setState] = useState<BlurShaderState>({
        filterSize: props.blurShader.getFilterSize()
    });

    function filterSizeChange(event: React.ChangeEvent<HTMLInputElement>)
    {
        props.blurShader.setFilterSize(+event.target.value);
        setState({filterSize: props.blurShader.getFilterSize()});
        props.onChange();
    }

    return <div>
        <input type="number" min={1} value={state.filterSize} onChange={filterSizeChange}></input>
    </div>;
}
