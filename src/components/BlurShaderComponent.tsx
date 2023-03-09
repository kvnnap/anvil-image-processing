import React from 'react';
import { ITextureResource } from '../resources/ITextureResource';
import { BlurShader } from '../shaders/BlurShader';

type BlurShaderProp = 
{
    blurShader: BlurShader,
    inputs: ITextureResource[],
    outputs: ITextureResource[],
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
