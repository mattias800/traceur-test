import {Inject} from "../di/index";
import {NameFormatter} from "./NameFormatter";

@Inject(NameFormatter)
export class Greeter {

    constructor (formatter : NameFormatter) {
        this.formatter = formatter;
    }

    sayHi(name : string = "Anonymous" ) {
        console.log("Hello " + this.formatter.format(name));
    }

}
