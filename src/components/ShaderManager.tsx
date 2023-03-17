import { useState } from "react";
import { BlurShader } from "../shaders/BlurShader";
import { FourierShader } from "../shaders/FourierShader";
import { IShader } from "../shaders/IShader";
import { ResourceManagerPropItem } from "./ResourceManager";
import { Selector } from "./Selector";
import { Shader } from "./Shader";

export type ShaderManagerItem = {
    id: number,
    shader: IShader
}

type ShaderManagerProps = {
    resources: ResourceManagerPropItem[],
    onShaderAdd?: (resource: ShaderManagerItem) => void,
    onCompute: VoidFunction
};
type ShaderManagerState = {};

type ShaderFactory = new() => IShader;
type ShaderType = {
    id: number,
    name: string,
    factory: ShaderFactory
}
const Shaders: ShaderType[] = 
[
    {id:0, factory:BlurShader, name: BlurShader.name},
    {id:1, factory:FourierShader, name: FourierShader.name}
]

export function ShaderManager(props: ShaderManagerProps)
{
    let [shaders, setShaders] = useState<ShaderManagerItem[]>([]);
    let [shaderId, setShaderId] = useState<number>(0); // For Factory
    let [counter, setCounter] = useState<number>(0);

    function addShader(sId: number)
    {
        setShaders(s => [...s, { id: counter, shader: new Shaders[sId].factory()}]);
        setCounter(c => c + 1);
    }

    function onChange(s: IShader){
        // s.compute();
        // props.onCompute();
    }

    function onMove(idx:number, dir: number)
    {
        setShaders(s => {
            let destinationIdx = idx + dir;
            if (destinationIdx < 0 || destinationIdx >= shaders.length)
                return [...s];
            return s.map((e, i) => {
                if (i === idx) return s[destinationIdx];
                if (i === destinationIdx) return s[idx];
                return e;
            });
        });
    }

    function onSelectionChange(id: number | undefined, res: ShaderType | undefined)
    {
        if (res)
            setShaderId(res.id);
    }

    function compute()
    {
        shaders.forEach(s => s.shader.compute());
        props.onCompute();
    }

    return <div>
        {shaders.map((s, idx) => <Shader key={s.id} onChange={onChange.bind(null, s.shader)} onMove={onMove.bind(null, idx)} resources={props.resources} shader={s.shader}></Shader>)}
        <Selector name={Shaders[shaderId].factory.name} resources={Shaders} current={Shaders[shaderId]} onChange={onSelectionChange}></Selector>
        <button onClick={() => addShader(shaderId)}>Add {Shaders[shaderId].factory.name}</button>
        <button onClick={compute}>Compute</button>
    </div>;
}
