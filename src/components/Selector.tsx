import { ChangeEvent } from "react";

type SelectorItemBase = {
    id: number,
    name?: string
}

type SelectorProps<T> = {
    id?: number,
    name?: string,
    resources: T[],
    current?: T,
    onChange?: (id: number | undefined, res: T | undefined) => void
}

export function Selector<T extends SelectorItemBase>(props: SelectorProps<T>)
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
            {props.resources.map((res) => <option key={res.id} value={res.id}>{res.id}{res.name ? ' - ' + res.name : ''}</option>)}
        </select>
    </div>;
}