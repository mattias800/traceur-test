import {Inject} from "../di/index";
import {NameFormatter} from "./NameFormatter";
import {$} from "jquery";

@Inject(NameFormatter)
export class Greeter {

    constructor (formatter : NameFormatter) : void {
        this.formatter = formatter;
    }

    sayHi(name : string = "Anonymous" ) : void {
        console.log("Hello " + this.formatter.format(name));
        $("body").append("hej");
    }

}
