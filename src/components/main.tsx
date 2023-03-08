import React from 'react';

type MainState = {
    counter: number
};

export class Main extends React.Component<{}, MainState>
{
    constructor(props: any)
    {
        super(props);
        this.state = {
            counter: 0
        };
    }

    click = () => {
        this.setState((state, props) => ({
            counter: state.counter + 1
        }));
    }

    render(): React.ReactNode {
        return <div onClick={this.click}>Main Component - a = {this.state.counter}</div>;
    }
}
