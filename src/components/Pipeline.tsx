import { useState } from 'react';
import { TextureResource } from '../resources/TextureResource';
import { ResourceManager, ResourceManagerPropItem } from './ResourceManager';
import { ShaderManager, ShaderManagerItem } from './ShaderManager';

type PipelineState = {
    resources: ResourceManagerPropItem[]
};

export function Pipeline()
{
    let [state, setState] = useState<PipelineState>(() => ({
        resources: [{
            texResource: new TextureResource(128, 128),
            writeCounter: 0,
            id: 0,
            name: 'input'
        }]
    }));

    function addTexResource(resource: ResourceManagerPropItem)
    {
        setState((prevState) => ({
            ...prevState,
            resources: [...prevState.resources, resource]
        }));
    }
    
    function onCompute()
    {
        setState(r => ({...r}));
    }

    return <div>
        <ResourceManager resources={state.resources} onResourceAdd={addTexResource}></ResourceManager>
        <ShaderManager resources={state.resources} onCompute={onCompute}></ShaderManager>
    </div>;
}
