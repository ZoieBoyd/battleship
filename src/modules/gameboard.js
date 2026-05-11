import { Ship } from "./ship.js";

export class Gameboard {
    constructor() {
        this.size = 10;
        this.board = new Array(this.size).fill(null).map(() => new Array(this.size).fill(null));
        this.ships = [
            new Ship(5, "carrier"),
            new Ship(4, "battleship"),
            new Ship(3, "destroyer"),
            new Ship(3, "submarine"),
            new Ship(2, "patrol boat"),
        ];
        this.hits = new Array();
        this.misses = new Array();
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

    placeRandomFleet() {
        this.ships.forEach((ship) => {
            let placed = false;
            while (!placed) {
                const randCoord = this.getRandMove();
                const direction = Math.random() < 0.5 ? "horizontal" : "vertical";
                try {
                    this.placeShip(ship, randCoord.x, randCoord.y, direction);
                    placed = true;
                } catch (error) {}
            }
        });
    }

    getRandMove() {
        const x = Math.floor(Math.random() * this.size);
        const y = Math.floor(Math.random() * this.size);
        return { x, y };
    }

    isOutOfBounds(length, axis) {
        return axis + (length - 1) >= this.size;
    }

    isMoveInBounds(coords) {
        return coords.every((coord) => coord >= 0 && coord < this.size);
    }

    isOccupied(x, y) {
        return this.board[x][y] !== null;
    }

    receiveAttack(x, y) {
        if (this.isHit(x, y)) {
            this.board[x][y].hit();
            this.hits.push([x, y]);
        } else {
            this.misses.push([x, y]);
        }
    }

    isHit(x, y) {
        return this.board[x][y] != null;
    }

    hasBeenAttacked(x, y) {
        return (
            this.hits.some((coord) => coord[0] === x && coord[1] === y) ||
            this.misses.some((coord) => coord[0] === x && coord[1] === y)
        );
    }

    isAllSunk() {
        return this.ships.every((ship) => ship.isSunk());
    }
}
