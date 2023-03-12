import { useState } from "react";
import { TextureResource } from "../resources/TextureResource";
import { TextureResourceComponent } from "./TexutreResourceComponent";

type ResourceManagerStateItem =
{
    id?: number,
    name?: string,
    texResource: TextureResource
}

type ResourceManagerState =  ResourceManagerStateItem[];

export function ResourceManager()
{
    const [state, setState] = useState<ResourceManagerState>([]);

    let texNodes = state.map((res)=> {
        return <TextureResourceComponent key={res.id} textureResource={res.texResource}></TextureResourceComponent>
    });
    return <div>{texNodes}</div>;
}
