import { Gameboard } from "../gameboard.js";

describe("Testing ship placement functionality", () => {
    test("Places ship of length 4 horizontally at [2, 5]", () => {
        const board = new Gameboard();
        board.placeShip(2, 5, 4);
        expect(board.shipCoords).toEqual([
            [2, 5],
            [2, 6],
            [2, 7],
            [2, 8],
        ]);
    });

    test("Places ship of length 2 at an out of bounds location [10, 10]", () => {
        const board = new Gameboard();
        expect(() => board.placeShip(10, 10, 2, horizontal)).toThrow();
    });

    test("Place ship of length 5 at [1, 1] and another ship of length 3 in an interlacting location [1, 3]", () => {
        const board = new Gameboard();
        board.placeShip(1, 1, 5);
        expect(() => board.placeShip(1, 3, 3, horizontal)).toThrow();
    });
});

describe("", () => {
    test("", () => {
        expect().toBe();
    });
});
