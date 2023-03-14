import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Vector2 } from '../math/Vector2';
import { TextureResource } from '../resources/TextureResource';

type TextureResourceProp = 
{
    textureResource: TextureResource,
    name: string,
    writeCounter: number
}

export function TextureResourceComponent(props : TextureResourceProp)
{
    let canvas = useRef<HTMLCanvasElement>();

    let [dim, setDim] = useState(props.textureResource.getDimensions());

    function updateCanvas()
    {
        let ctx = canvas.current.getContext('2d');
        let dim = props.textureResource.getDimensions();
        ctx.putImageData(new ImageData(props.textureResource.getData(), dim.x), 0, 0);
    }

    useEffect(() => {
        updateCanvas();
    });

    function handleFileChange(event: ChangeEvent<HTMLInputElement>)
    {
        let file = event.target.files[0];

        // For normal image types, read rgb using canvas
        let image = new Image();
        image.src = URL.createObjectURL(file)
        image.onload = (ev: Event) => {
            canvas.current.width = image.width;
            canvas.current.height = image.height;
            let ctx = canvas.current.getContext('2d');
            ctx.drawImage(image, 0, 0);
            let imageData = ctx.getImageData(0, 0, image.width, image.height);
            props.textureResource.setData(imageData.data, image.width, image.height);
            setDim(new Vector2(image.width, image.height));
        };
    }

    return <div>
        <div className='grid-container'>
            <div className='resizable' style={{width: 128}}>
                <canvas ref={canvas} width={dim.x} height={dim.y}></canvas>
            </div>
        </div>
        
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <span>{props.name}</span>
    </div>;
}

