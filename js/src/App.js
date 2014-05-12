import {Injector} from "./di/injector";
import {Greeter} from "./greeter/Greeter";

console.log("Creating greeter..");
var injector = new Injector();
var greeter = injector.get(Greeter);

function say(greeterss : Greeter) {
    greeterss.sayHi("Mattias");
}

say(greeter);