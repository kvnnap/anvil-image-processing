import React from 'react';
import { TextureResource } from '../resources/TextureResource';

type TextureResourceProp = 
{
    textureResource: TextureResource
}

export class TextureResourceComponent extends React.Component<TextureResourceProp>
{
    private canvas: React.RefObject<HTMLCanvasElement> = React.createRef();

    private updateCanvas()
    {
        let canvas = this.canvas.current;
        let ctx = canvas.getContext('2d');
        let dim = this.props.textureResource.getDimensions();
        ctx.putImageData(new ImageData(this.props.textureResource.getData(), dim.x), 0, 0);
    }

    componentDidMount(): void
    {
        this.updateCanvas();
    }

    componentDidUpdate(prevProps: Readonly<TextureResourceProp>, prevState: Readonly<{}>, snapshot?: any): void {
        //if (this.prevData !== this.props.textureResource.getData())
        {
            this.updateCanvas();
        }
    }

    render(): React.ReactNode
    {
        let dim = this.props.textureResource.getDimensions();
        return <div>
            <span>Texture Resource ({dim.x} , {dim.y})</span>
            <canvas ref={this.canvas} width={dim.x} height={dim.y}></canvas>
        </div>;
    }
}
