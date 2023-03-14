import React from 'react';
import { TextureResource } from '../resources/TextureResource';
import { BlurShader } from '../shaders/BlurShader';
import { IShader } from '../shaders/IShader';
import { ResourceManager, ResourceManagerPropItem } from './ResourceManager';
import { Shader } from './Shader';

type PipelineState = {
    shaders: IShader[]
    resources: ResourceManagerPropItem[]
};

export class Pipeline extends React.Component<{}, PipelineState>
{
    constructor(props: any)
    {
        super(props);
        this.state = {
            shaders: [],
            resources: [{
                texResource: new TextureResource(128, 128),
                writeCounter: 0,
                id: 0,
                name: 'input'
            }]
        };
    }

    clickAddShader = () => {
        this.setState((state) => ({
            shaders: [...state.shaders, new BlurShader()]
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
        this.setState((state) => ({
            resources: [...state.resources]
        }));
    }

    addTexResource = (resource: ResourceManagerPropItem) =>
    {
        this.setState((state) => ({
            resources: [...state.resources, resource]
        }));
    }

    render(): React.ReactNode {
        let shadNodes = this.state.shaders.map((shader, index) => {
            return <Shader key={index} onChange={this.onChange} resources={this.state.resources} shader={shader}></Shader>;
        });
        return <div>

            <ResourceManager resources={this.state.resources} onResourceAdd={this.addTexResource}></ResourceManager>
            <div>
                {shadNodes}
            </div>
            <button onClick={this.clickAddShader}>Add Shader</button>
            
        </div>;
    }
}
