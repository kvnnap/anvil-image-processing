import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Vector2 } from '../math/Vector2';
import { TextureResource } from '../resources/TextureResource';
import { OrderedCheckboxes } from './OrderedCheckboxes';

type TextureResourceProp = 
{
    textureResource: TextureResource,
    name?: string
}

function AlphaCorrectionChain(data: number[]) {
    let gamma = 2.4;
    let encodingGamma = 1 / gamma;
    return data.map(d => d <= 0.0031308 ? d * 12.92 : 1.055 * Math.pow(d, encodingGamma) - 0.055);
}

function ToneMappingChain(data: number[]) {
    return data.map(d => d / (d + 1));
}

const Chains = [
    {id: 0, name: "Alpha Correction", fn: AlphaCorrectionChain},
    {id: 1, name: "Tone Mapping", fn: ToneMappingChain}
];
type ChainsType = typeof Chains;

export function TextureResourceComponent(props : TextureResourceProp)
{
    let canvas = useRef<HTMLCanvasElement>(null);

    let [dim, setDim] = useState(props.textureResource.getDimensions());
    let [chain, setChain] = useState<ChainsType>();

    function updateCanvas()
    {
        let ctx = canvas.current?.getContext('2d');
        if (ctx == null) return;
        let rawData = Array.from(props.textureResource.getData());
        chain?.forEach(c => rawData = c.fn(rawData));
        let data = new Uint8ClampedArray(rawData.map(v => v * 255.0));
        ctx.putImageData(new ImageData(data, dim.x), 0, 0);
    }

    useEffect(() => {
        updateCanvas();
    });

    function handleFileChange(event: ChangeEvent<HTMLInputElement>)
    {
        let file = event.target.files?.[0];
        if (file == null) return;

        // For normal image types, read rgb using canvas
        let image = new Image();
        image.src = URL.createObjectURL(file)
        image.onload = (ev: Event) => {
            if (canvas.current === null) return;
            canvas.current.width = image.width;
            canvas.current.height = image.height;
            let ctx = canvas.current.getContext('2d');
            if (ctx == null) return;
            ctx.drawImage(image, 0, 0);
            let imageData = ctx.getImageData(0, 0, image.width, image.height);
            const r = 1 / 255;
            let data = new Float32Array(Array.from(imageData.data).map(v => v * r));
            props.textureResource.setData(data, image.width, image.height);
            setDim(new Vector2(image.width, image.height));
        };
    }

    function postProcChainChange(chain: ChainsType)
    {
        setChain(chain);
    }

    return <div>
        <div className='grid-container'>
            <div className='resizable' style={{width: 128}}>
                <canvas ref={canvas} width={dim.x} height={dim.y}></canvas>
            </div>
        </div>
        
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <span>{props.name}</span>
        <OrderedCheckboxes items={Chains} onSelectionChange={postProcChainChange}></OrderedCheckboxes>
    </div>;
}

