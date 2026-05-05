export class Ship {
    constructor(length, name) {
        this.length = length;
        this.hits = 0;
        this.name = name;
    }

    hit() {
        this.hits += 1;
    }

    isSunk() {
        return this.hits >= this.length;
    }
}
