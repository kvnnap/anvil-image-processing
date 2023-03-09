import React from 'react';
import { ITextureResource } from '../resources/ITextureResource';
import { BlurShader } from '../shaders/BlurShader';
import { IShader } from '../shaders/IShader';
import { IShaderVisitor } from '../shaders/IShaderVisitor';
import { BlurShaderComponent } from './BlurShaderComponent';

type ShaderProperty =
{
    shader: IShader,
    inputs: ITextureResource[],
    outputs: ITextureResource[],
    onChange: VoidFunction
}


export class Shader extends React.Component<ShaderProperty> implements IShaderVisitor
{
    constructor(props: ShaderProperty)
    {
        super(props);
        this.props.shader.setInputs(this.props.inputs);
        this.props.shader.setOutputs(this.props.outputs);
    }

    private node:React.ReactNode;
    visitBlur(s: BlurShader): void 
    {
        this.node = <BlurShaderComponent onChange={this.props.onChange} inputs={this.props.inputs} outputs={this.props.outputs} blurShader={s} />;
    }

    render(): React.ReactNode 
    {
        this.props.shader.accept(this);
        return this.node;
    }
}
