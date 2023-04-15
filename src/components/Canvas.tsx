import { useEffect, useRef } from "react";

type CanvasProps = {
    data: Uint8ClampedArray,
    width: number
};

export function Canvas(props: CanvasProps)
{
    const canvas = useRef<HTMLCanvasElement>(null);

    function updateCanvas()
    {
        if (canvas?.current == null)
            return;
        let ctx = canvas.current.getContext('2d');
        if (ctx == null)
            return;
        canvas.current.width = props.width;
        canvas.current.height = props.data.length / (props.width << 2);
        if (props.data.length === 0 || props.width <= 0)
            return;
        ctx.putImageData(new ImageData(props.data, props.width), 0, 0);
    }

    useEffect(() => {
        updateCanvas();
    }, [props.data, props.width]);

    return  <div className='grid-container'>
                <div className='resizable' style={{width: 128}}>
                    <canvas ref={canvas}></canvas>
                </div>
            </div>;
}