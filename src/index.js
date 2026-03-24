import "./styles.css";
import { createGameBoard } from "./modules/dom";

createGameBoard("player-gameboard");
createGameBoard("cpu-gameboard");
/*
import { Gameboard } from "./modules/gameboard.js";
import { Ship } from "./modules/ship.js";

const board = new Gameboard();

const carrier = new Ship(5, "carrier");
const patrolBoat = new Ship(2, "patrol boat");

board.placeShip(carrier, 1, 1, "vertical");
board.placeShip(patrolBoat, 4, 2, "horizontal");

board.receiveAttack(1, 1);
board.receiveAttack(2, 1);

console.log(board.board);
*/
