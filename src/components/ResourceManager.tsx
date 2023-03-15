import { useRef } from "react";
import { TextureResource } from "../resources/TextureResource";
import { TextureResourceComponent } from "./TexutreResourceComponent";

export type ResourceManagerPropItem =
{
    id: number,
    name?: string,
    texResource: TextureResource,
    writeCounter: number
}

type ResourceManagerProps = {
    resources: ResourceManagerPropItem[],
    onResourceAdd: (resource: ResourceManagerPropItem) => void
};

export function ResourceManager(props: ResourceManagerProps)
{
    let num = useRef<number>(props.resources.length);
    let name = useRef<string>('');

    let texNodes = props.resources.map((res)=> {
        return <TextureResourceComponent key={res.id} textureResource={res.texResource} name={res.name} writeCounter={res.writeCounter}></TextureResourceComponent>
    });

    function clickAddTexRes() {
        let dim = props.resources[0].texResource.getDimensions();
        props.onResourceAdd({
            id: num.current++,
            name: name.current,
            texResource: new TextureResource(dim.x, dim.y),
            writeCounter: 0
        });
    }

    function nameChange(event: React.ChangeEvent<HTMLInputElement>)
    {
        name.current = event.target.value;
    }

    return <div>
            <div>{texNodes}</div>
            <input type="text" onChange={nameChange}></input>
            <button onClick={clickAddTexRes}>Add Texture Resource</button>
        </div>;
}
