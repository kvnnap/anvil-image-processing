export class Vector4 
{
    r:number;
    g:number;
    b:number;
    a:number;

    constructor(r: number = 0, g: number = 0, b:number = 0, a:number = 0)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    mul(o: Vector4) : Vector4
    {
        return this.clone().mulSelf(o);
    }

    mulScalar(s: number) : Vector4
    {
        return this.mul(new Vector4(s, s, s, s));
    }

    mulSelf(o: Vector4): Vector4
    {
        this.r *= o.r;
        this.g *= o.g;
        this.b *= o.b;
        this.a *= o.a;
        return this;
    }

    addSelf(o: Vector4): Vector4
    {
        this.r += o.r;
        this.g += o.g;
        this.b += o.b;
        this.a += o.a;
        return this;
    }

    clone() : Vector4
    {
        return new Vector4(this.r, this.g, this.b, this.a);
    }
}