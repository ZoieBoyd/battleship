import { Gameboard } from "../gameboard.js";
import { Ship } from "../ship.js";

describe("Testing ship placement functionality", () => {
    test("Places ship of length 4 horizontally at [2, 5]", () => {
        const board = new Gameboard();
        const battleship = new Ship(4, "battleship");
        board.placeShip(battleship, 2, 5, "horizontal");
        expect(board.board[2][5]).toBe(battleship);
        expect(board.board[2][6]).toBe(battleship);
        expect(board.board[2][7]).toBe(battleship);
        expect(board.board[2][8]).toBe(battleship);
    });

    test("Places ship of length 2 at an out of bounds location [10, 10]", () => {
        const board = new Gameboard();
        expect(() => board.placeShip(new Ship(2, "patrol boat"), 10, 10, "horizontal")).toThrow();
    });

    test("Place ship of length 5 at [1, 1] and another ship of length 3 in an interlacting location [1, 3]", () => {
        const board = new Gameboard();
        board.placeShip(new Ship(5, "carrier"), 1, 1, "horizontal");
        expect(() => board.placeShip(new Ship(3, "destoyer"), 1, 3, "horizontal")).toThrow();
    });
});

describe("", () => {
    test("", () => {
        expect().toBe();
    });
});
