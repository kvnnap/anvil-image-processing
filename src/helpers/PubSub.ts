type Callback<T> = (data: T) => void;

export class PubSub<T>
{
    constructor(private subs: Callback<T>[]){}
    
    publish(data: T, exclude?: Callback<T>)
    {
        this.subs.forEach(fn => {
            if (exclude !== fn)
                fn(data);
        });
    }

    subscribe(cb: Callback<T>)
    {
        this.subs.push(cb);
        // Return unsubscription function
        return {
            unsubscribe: () => {
                let index = this.subs.indexOf(cb);
                if (index !== -1)
                    this.subs.splice(index, 1);
            },
            publish: (data: T, include: boolean) => this.publish(data, include ? undefined : cb)
        };
    }
}