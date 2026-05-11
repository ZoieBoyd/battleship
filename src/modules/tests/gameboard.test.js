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

    test("Places ship of length 3 vertically at [1, 1]", () => {
        const board = new Gameboard();
        const destroyer = new Ship(3, "destroyer");
        board.placeShip(destroyer, 1, 1, "vertical");
        expect(board.board[1][1]).toBe(destroyer);
        expect(board.board[2][1]).toBe(destroyer);
        expect(board.board[3][1]).toBe(destroyer);
    });

    test("Places ship of length 2 at an out of bounds location [10, 10]", () => {
        const board = new Gameboard();
        expect(() => board.placeShip(new Ship(2, "patrol boat"), 10, 10, "horizontal")).toThrow();
    });

    test("Place ship of length 5 at [1, 1] and another ship of length 3 in an interlacting location [1, 3]", () => {
        const board = new Gameboard();
        const carrier = new Ship(5, "carrier");
        board.placeShip(carrier, 1, 1, "horizontal");
        expect(() => board.placeShip(new Ship(3, "destoyer"), 1, 3, "horizontal")).toThrow();
    });

    test("Places fleet comprised of randomly generated coordinates on gameboard", () => {
        const board = new Gameboard();
        board.placeRandomFleet();
        expect(
            board.ships.every((ship) => board.board.some((row) => row.includes(ship))),
        ).toBeTruthy();
    });
});

describe("Testing attack functionality", () => {
    test("Registers hit when attacking coordinate occupied by ship", () => {
        const board = new Gameboard();
        const patrolBoat = new Ship(2, "patrol boat");
        board.placeShip(patrolBoat, 3, 6, "horizontal");
        board.receiveAttack(3, 6);
        expect(board.hits.some((coord) => coord[0] === 3 && coord[1] === 6)).toBeTruthy();
    });

    test("Registers miss when attacking coordinate not occupied by ship", () => {
        const board = new Gameboard();
        const submarine = new Ship(3, "submarine");
        board.placeShip(submarine, 0, 1, "vertical");
        board.receiveAttack(7, 4);
        expect(board.misses.some((coord) => coord[0] === 7 && coord[1] === 4)).toBeTruthy();
    });

    test("Registers all ships as sunk whenever each ship coordinate is attacked", () => {
        const board = new Gameboard();
        board.ships.forEach((ship) => {
            for (let i = 0; i < ship.length; i++) {
                ship.hit();
            }
        });
        expect(board.isAllSunk()).toBeTruthy();
    });

    test("Returns false for out of bounds coordinates", () => {
        const board = new Gameboard();
        expect(board.isMoveInBounds([10, 1])).toBeFalsy();
    });

    test("Returns true for in bounds coordinates", () => {
        const board = new Gameboard();
        expect(board.isMoveInBounds([3, 7])).toBeTruthy();
    });
});
