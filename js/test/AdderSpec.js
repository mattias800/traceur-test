import {Injector} from "../src/di/injector";
import {Adder} from "../src/Adder";

describe("Adder", function() {

    var injector = new Injector();
    var adder = injector.get(Adder);

    it("should work", function() {
        expect(true).toBeTruthy();
    });
    it("should add", function() {
        expect(adder.add(1, 2)).toBe(3);
    });

});

