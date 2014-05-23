import {Provide} from "../di/annotations";
import {NameFormatter} from "./NameFormatter";

@Provide(NameFormatter)
export class NameFormatterStub extends NameFormatter {

    format(name:string):string {
        return name.toLowerCase();
    }

}

