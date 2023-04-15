import { useState } from 'react';
import { TextureResource } from '../resources/TextureResource';
import { ResourceManager, ResourceManagerPropItem } from './ResourceManager';
import { ShaderManager } from './ShaderManager';
import { PubSub } from '../helpers/PubSub';

type PipelineState = {
    resources: ResourceManagerPropItem[]
};

export function Pipeline()
{
    let [state, setState] = useState<PipelineState>(() => ({
        resources: [{
            texResource: new TextureResource(128, 128),
            texResPubSub: new PubSub<number>(),
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
