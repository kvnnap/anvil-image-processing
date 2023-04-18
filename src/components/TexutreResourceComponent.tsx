import { ChangeEvent, useEffect, useReducer, useRef, useState } from 'react';
import { OrderedCheckboxes } from './OrderedCheckboxes';
import { Canvas } from './Canvas';
import { ResourceManagerPropItem } from './ResourceManager';

type TextureResourceProp = 
{
    res: ResourceManagerPropItem
}

function AlphaCorrectionChain(data: number[]) {
    let gamma = 2.4;
    let encodingGamma = 1 / gamma;
    return data.map(d => d <= 0.0031308 ? d * 12.92 : 1.055 * Math.pow(d, encodingGamma) - 0.055);
}

function ToneMappingChain(data: number[]) {
    return data.map(d => d / (d + 1));
}

function LogMapChain(data: number[]) {
    return data.map(d => Math.log10(d + 1));
}

const Chains = [
    {id: 0, name: "Log", fn: LogMapChain},
    {id: 1, name: "Alpha Correction", fn: AlphaCorrectionChain},
    {id: 2, name: "Tone Mapping", fn: ToneMappingChain}
];
type ChainsType = typeof Chains;

export function TextureResourceComponent(props : TextureResourceProp)
{
    const [chain, setChain] = useState<ChainsType>([]);
    const [data, setData] = useState<Uint8ClampedArray>(() => new Uint8ClampedArray());
    const texResource = props.res.texResource;

    function updateCanvas()
    {
        let rawData = Array.from(texResource.getData());
        chain?.forEach(c => rawData = c.fn(rawData));
        setData(new Uint8ClampedArray(rawData.map(v => v * 255.0)));
    }

    useEffect(() => {
        updateCanvas();
    }, [chain]);

    useEffect(()=>{
        const subscription = props.res.texResPubSub.subscribe(updateCanvas);
        return () => subscription.unsubscribe();
    }, []);

    function handleFileChange(event: ChangeEvent<HTMLInputElement>)
    {
        let file = event.target.files?.[0];
        if (file == null) return;

        // For normal image types, read rgb using canvas
        let image = new Image();
        image.src = URL.createObjectURL(file)
        image.onload = (ev: Event) => {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            if (ctx == null) return;
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            let imageData = ctx.getImageData(0, 0, image.width, image.height);
            const r = 1.0 / 255.0;
            let data = new Float32Array(Array.from(imageData.data).map(v => v * r));
            texResource.setData(data, image.width, image.height);
            props.res.texResPubSub.publish(1);
        };
    }

    return <div>
        <Canvas data={data} width={texResource.getDimensions().x}></Canvas>
        
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <span>{props.res.name}</span>
        <OrderedCheckboxes items={Chains} onSelectionChange={c => setChain(c)}></OrderedCheckboxes>
    </div>;
}

