import React, { useEffect, useState } from 'react';
import { BlurShader } from '../shaders/BlurShader';
import { IShader } from '../shaders/IShader';
import { IShaderVisitor } from '../shaders/IShaderVisitor';
import { BlurShaderComponent } from './BlurShaderComponent';
import { ResourceManagerPropItem } from './ResourceManager';
import { Selector } from './Selector';

type ShaderProperty =
{
    shader: IShader,
    resources: ResourceManagerPropItem[],
    onChange: VoidFunction,
    onMove: (dir: number) => void
}

class ShaderComponentVisitor implements IShaderVisitor
{
    public Node:React.ReactNode;
    public NumInputs: number;
    public NumOutputs: number;

    constructor(private props: ShaderProperty){};

    visitBlur(s: BlurShader): void
    {
        this.Node = <BlurShaderComponent onChange={this.props.onChange} resources={this.props.resources} blurShader={s} />;
        this.NumInputs = this.NumOutputs = 1;
    }
    
}

export function Shader(props:ShaderProperty)
{
    if (props.resources.length === 0) return null;

    let visitor = new ShaderComponentVisitor(props);
    props.shader.accept(visitor);

    let [shaderInputs, setShaderInputs] = useState<ResourceManagerPropItem[]>(() => Array(visitor.NumInputs).fill(props.resources[0]));
    let [shaderOutputs, setShaderOutputs] = useState<ResourceManagerPropItem[]>(() => Array(visitor.NumOutputs).fill(props.resources[0]));

    useEffect(() => {
        props.shader.setInputs(shaderInputs.map((e) => e.texResource));
    }, [shaderInputs]);

    useEffect(() => {
        props.shader.setOutputs(shaderOutputs.map((e) => e.texResource));
    }, [shaderOutputs]);

    function inputChange(id: number, inputRes: ResourceManagerPropItem)
    {
        let temp = [...shaderInputs];
        temp[id] = inputRes;
        setShaderInputs(temp);
    }

    function outputChange(id: number, outputRes: ResourceManagerPropItem)
    {
        let temp = [...shaderOutputs];
        temp[id] = outputRes;
        setShaderOutputs(temp);
    }

    return <div>
        {shaderInputs.map((e, id) => <Selector key={id} id={id} name={'input #'} current={e} resources={props.resources} onChange={inputChange}></Selector>)} 
        {shaderInputs.map((e, id) => <Selector key={id} id={id} name={'output #'} current={e} resources={props.resources} onChange={outputChange}></Selector>)} 
        {visitor.Node}
        <button onClick={() => props.onMove(-1)}>Up</button>
        <button onClick={() => props.onMove(1)}>Down</button>
    </div>;
}
