import React from 'react';
import { ITextureResource } from '../resources/ITextureResource';
import { TextureResource } from '../resources/TextureResource';
import { BlurShader } from '../shaders/BlurShader';
import { IShader } from '../shaders/IShader';
import { Shader } from './Shader';
import { TextureResourceComponent } from './TexutreResourceComponent';

type PipelineState = {
    shaders: IShader[]
    textureResources: TextureResource[]
};

export class Pipeline extends React.Component<{}, PipelineState>
{
    constructor(props: any)
    {
        super(props);
        this.state = {
            shaders: [],
            textureResources: [new TextureResource(128, 128), new TextureResource(128, 128)]
        };
    }

    clickAddShader = () => {
        this.setState((state, props) => ({
            shaders: [...state.shaders, new BlurShader()]
        }));
    }

    clickAddTexRes = () => {
        this.setState((state, props) => ({
            textureResources: [...state.textureResources, new TextureResource(128, 128)]
        }));
    }

    onChange = () => {
        this.computeShaders();
        //alert('test');
    }

    computeShaders() {
        this.state.shaders.forEach((s) => {
            s.compute();
        });
        // we may need deep copy here
        this.setState((state, props) => ({
            textureResources: [...state.textureResources]
        }));
    }

    render(): React.ReactNode {
        let shadNodes = this.state.shaders.map((shader, index) => {
            return <Shader key={index} onChange={this.onChange} inputs={[this.state.textureResources[0]]} outputs={[this.state.textureResources[1]]} shader={shader}></Shader>;
        });
        let texNodes = this.state.textureResources.map((texRes, index)=> {
            return <TextureResourceComponent key={index} textureResource={texRes}></TextureResourceComponent>
        });
        return <div>
            <div>
                {texNodes}
            </div>
            <button onClick={this.clickAddTexRes}>Add Texture Resource</button>
            <div>
                {shadNodes}
            </div>
            <button onClick={this.clickAddShader}>Add Shader</button>
        </div>;
    }
}
