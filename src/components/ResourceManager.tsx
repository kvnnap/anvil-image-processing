import { useRef, useState } from "react";
import { TextureResource } from "../resources/TextureResource";
import { TextureResourceComponent } from "./TexutreResourceComponent";

export type ResourceManagerPropItem =
{
    id: number,
    name?: string,
    texResource: TextureResource
}

type ResourceManagerProps = {
    resources: ResourceManagerPropItem[],
    onResourceAdd: (resource: ResourceManagerPropItem) => void
};

export function ResourceManager(props: ResourceManagerProps)
{
    let num = useRef<number>(props.resources.length);
    let [name, setName] = useState<string>('');

    let texNodes = props.resources.map((res)=> {
        return <TextureResourceComponent key={res.id} textureResource={res.texResource} name={res.name}></TextureResourceComponent>
    });

    function clickAddTexRes() {
        let dim = props.resources[0].texResource.getDimensions();
        props.onResourceAdd({
            id: num.current++,
            name: name,
            texResource: new TextureResource(dim.x, dim.y)
        });
        setName('');
    }

    function nameChange(event: React.ChangeEvent<HTMLInputElement>)
    {
        setName(event.target.value);
    }

    return <div>
            <div>{texNodes}</div>
            <input type="text" value={name} onChange={nameChange}></input>
            <button onClick={clickAddTexRes}>Add Texture Resource</button>
        </div>;
}
