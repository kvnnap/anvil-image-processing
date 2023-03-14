import React from 'react';
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

export class BlurShaderComponent extends React.Component<BlurShaderProp, BlurShaderState>
{
    constructor(props : BlurShaderProp)
    {
        super(props);
        this.state = {
            filterSize: props.blurShader.getFilterSize()
        };
    }

    filterSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => 
    {
        this.props.blurShader.setFilterSize(+event.target.value);
        this.setState({filterSize: this.props.blurShader.getFilterSize()});
        this.props.onChange();
    }

    render(): React.ReactNode {
        return <div>
            <input type="number" min={1} value={this.state.filterSize} onChange={this.filterSizeChange}></input>
        </div>;
    }
}
