import { Gameboard } from "./gameboard.js";

export class Player {
    constructor(name) {
        //this.type = type; // Real or CPU
        this.name = name;
        this.gameboard = new Gameboard();
    }
}
