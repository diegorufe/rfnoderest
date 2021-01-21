function f() {
    console.log("f(): evaluated");
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        let originalMethod = descriptor.value;
        //wrapping the original method
        descriptor.value = function (...args: any[]) {
            //console.log("wrapped function: before invoking " + propertyKey);
            //console.log(args);
            args[0] = { "TR": "NO" }
            let result = originalMethod.apply(this, args);
            //console.log("wrapped function: after invoking " + propertyKey);
            return result;
        }
        console.log("f(): called");
    };
}

function g() {
    console.log("g(): evaluated");
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        //   console.log(target);
        //  console.log(propertyKey);
        //console.log(descriptor);
        console.log("g(): called");
    };
}

class C {
    @f()
    @g()
    async method(mapParams: {}) { console.log("Call"); return mapParams; }
}

const c = new C();

let a = c.method({ "TR": "YES" });
console.log(a);