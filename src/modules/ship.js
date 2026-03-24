export class Ship {
    constructor(length, name) {
        this.length = length;
        this.hits = 0;
        this.name = name; // optional? i might remove this lol. i.e. Carrier, Battleship, Destroyer, Submarine and Patrol Boat
    }

    hit() {
        this.hits += 1;
    }

    isSunk() {
        return this.hits >= this.length;
    }
}
