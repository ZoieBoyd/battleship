import { Ship } from "../ship.js";

describe("Testing ship sinking functionality", () => {
    test("Check if ship of length 4 has successfully sunk after 4 hits.", () => {
        const ship = new Ship(4);
        for (let i = 0; i < ship.length; i++) {
            ship.hit();
        }
        expect(ship.isSunk()).toBe(true);
    });

    test("Check if ship of length 4 is still afloat after 1 hit.", () => {
        const ship = new Ship(4);
        ship.hit();
        expect(ship.isSunk()).toBe(false);
    });
});
