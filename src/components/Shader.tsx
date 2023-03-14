import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { ITextureResource } from '../resources/ITextureResource';
import { BlurShader } from '../shaders/BlurShader';
import { IShader } from '../shaders/IShader';
import { IShaderVisitor } from '../shaders/IShaderVisitor';
import { BlurShaderComponent } from './BlurShaderComponent';
import { ResourceManagerPropItem } from './ResourceManager';

type ShaderProperty =
{
    shader: IShader,
    resources: ResourceManagerPropItem[],
    onChange: VoidFunction
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

type ResourceSelectorProps = {
    name: string,
    id: number,
    resources: ResourceManagerPropItem[],
    current?: ResourceManagerPropItem,
    onChange?: (id:number, res: ResourceManagerPropItem) => void
}
function ResourceSelector(props: ResourceSelectorProps)
{
    function onChange(e : ChangeEvent<HTMLSelectElement>)
    {
        if (props.onChange)
            props.onChange(props.id, props.resources.find((res) => res.id === parseInt(e.target.value)));
    }
    return props.resources.length == 0 ? null : 
    <div>
        <span>{props.name}{props.id}</span>
        <select onChange={onChange} defaultValue={props.current?.id || props.resources[0].id}>
            {props.resources.map((res) => <option key={res.id} value={res.id}>{res.id} - {res.name}</option>)}
        </select>
    </div>;
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
        {shaderInputs.map((e, id) => <ResourceSelector key={id} id={id} name={'input #'} current={e} resources={props.resources} onChange={inputChange}></ResourceSelector>)} 
        {shaderInputs.map((e, id) => <ResourceSelector key={id} id={id} name={'output #'} current={e} resources={props.resources} onChange={outputChange}></ResourceSelector>)} 
        {visitor.Node} 
    </div>;
}
