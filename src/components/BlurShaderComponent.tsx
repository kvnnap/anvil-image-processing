import React, { useState } from 'react';
import { BlurShader } from '../shaders/BlurShader';
import { ResourceManagerPropItem } from './ResourceManager';

type BlurShaderProp = 
{
    blurShader: BlurShader,
    resources: ResourceManagerPropItem[],
    onChange: VoidFunction
}

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
