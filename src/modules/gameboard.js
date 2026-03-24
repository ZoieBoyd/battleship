import { Ship } from "./ship.js";

export class Gameboard {
    constructor() {
        this.size = 10;
        this.board = new Array(this.size).fill(null).map(() => new Array(this.size).fill(null));
    }

    placeShip(ship, x, y, direction) {
        const shipCoords = new Array();
        switch (direction) {
            case "horizontal":
                if (this.isOutOfBounds(ship.length, y)) {
                    throw new Error("Invalid Placement");
                }
                for (let i = 0; i < ship.length; i++) {
                    shipCoords.push([x, y + i]);
                }
                break;

            case "vertical":
                if (this.isOutOfBounds(ship.length, x)) {
                    throw new Error("Invalid Placement");
                }
                for (let i = 0; i < ship.length; i++) {
                    shipCoords.push([x + i, y]);
                }
                break;

            default:
                throw new Error("Invalid direction");
        }

        if (shipCoords.some(([coordX, coordY]) => this.isOccupied(coordX, coordY))) {
            throw new Error("Space is occupied");
        }

        shipCoords.forEach(([coordX, coordY]) => {
            this.board[coordX][coordY] = ship;
        });
    }

    isOutOfBounds(length, axis) {
        return axis + (length - 1) >= this.size;
    }

    isOccupied(x, y) {
        return this.board[x][y] !== null;
    }

    receiveAttack(x, y) {
        if (this.isHit(x, y)) {
            this.board[x][y].hit();
        } else {
            this.board[x][y] = ".";
        }
    }

    isHit(x, y) {
        return this.board[x][y] instanceof Ship;
    }
}
