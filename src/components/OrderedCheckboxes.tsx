import { useEffect, useRef, useState } from "react";

type ItemBase = {
    id: number,
    name: string
}

type OrderedCheckboxesProps<T extends ItemBase> = {
    items: T[],
    selected?: T[],
    onSelectionChange: (items:T[]) => void,
};

type ItemWithChecked<T> =  T & {
    checked: boolean
}

function useIsFirstRender() : boolean
{
    const isFirst = useRef<boolean>(true);
    if (isFirst.current)
    {
        isFirst.current = false;
        return true;
    }
    return isFirst.current;
}

export function OrderedCheckboxes<T extends ItemBase>(props: OrderedCheckboxesProps<T>)
{
    function initItems()
    {
        return props.items.map(v => ({...v, checked: (props.selected?.indexOf(v) ?? -1) >= 0}));
    }
    
    let [items, setItems] = useState<ItemWithChecked<T>[]>(initItems);
    let firstRender = useIsFirstRender();

    // This should never happen, parent changing items for Texture Post Proc methods
    useEffect(() => {
        if (firstRender) return;
        setItems(initItems());
    }, [props.items, props.selected]);

    // Whenever items (state) change, update the parent
    useEffect(() => {
        if (firstRender) return;
        props.onSelectionChange(items.filter(p => p.checked));
    }, [items]);

    function onChange(checked: boolean, i: number)
    {
        setItems((prev) => {
            let updated = [...prev];
            updated[i].checked = checked;
            return updated;
        });
    }
    
    function onMove(idx:number, dir: number)
    {
        setItems(s => {
            let destinationIdx = idx + dir;
            if (destinationIdx < 0 || destinationIdx >= s.length)
                return [...s];
            return s.map((e, i) => {
                if (i === idx) return s[destinationIdx];
                if (i === destinationIdx) return s[idx];
                return e;
            });
        });
    }

    return <div>
        {items.map((v, i) => <div key={v.id}>
            <input 
            type={"checkbox"} 
            checked={v.checked} 
            onChange={(e) => onChange(e.target.checked, i)}></input>
            <span>{v.name}</span>
            <button onClick={() => onMove(i, -1)}>Up</button>
            <button onClick={() => onMove(i, 1)}>Down</button>
            </div>)}
    </div>;
}
