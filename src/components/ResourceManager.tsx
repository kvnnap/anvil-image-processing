import { useRef, useState } from "react";
import { TextureResource } from "../resources/TextureResource";
import { TextureResourceComponent } from "./TexutreResourceComponent";
import { PubSub } from "../helpers/PubSub";

export type ResourceManagerPropItem =
{
    id: number,
    name?: string,
    texResource: TextureResource,
    texResPubSub: PubSub<number>
}

type ResourceManagerProps = {
    resources: ResourceManagerPropItem[],
    onResourceAdd: (resource: ResourceManagerPropItem) => void
};

export function ResourceManager(props: ResourceManagerProps)
{
    let num = useRef<number>(props.resources.length);
    let nameRef = useRef<HTMLInputElement>(null);

    let texNodes = props.resources.map((res)=> {
        return <TextureResourceComponent key={res.id} res={res}></TextureResourceComponent>
    });

    function clickAddTexRes() {
        if (!nameRef.current?.value)
            return;
        let dim = props.resources[0].texResource.getDimensions();
        props.onResourceAdd({
            id: num.current++,
            name: nameRef.current?.value,
            texResource: new TextureResource(dim.x, dim.y),
            texResPubSub: new PubSub<number>()
        });
        nameRef.current.value = '';
    }

    return <div>
            <div>{texNodes}</div>
            <input ref={nameRef} type="text"></input>
            <button onClick={clickAddTexRes}>Add Texture Resource</button>
        </div>;
}
