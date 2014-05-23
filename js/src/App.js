System.map['jquery'] = "../deps/jquery";

import {Injector} from "./di/injector";
import {Greeter} from "./greeter/Greeter";
import {NameFormatterStub} from "./greeter/NameFormatterStub";

var injector = new Injector([NameFormatterStub]);
var greeter = injector.get(Greeter);

    function say(greeterss:Greeter) {
    greeterss.sayHi("Mattias");
}

say(greeter);

