import "./styles.css";
import { loadGameScreen, loadSetupScreen, createGameBoard } from "./modules/dom";
import { playGame } from "./modules/gameController.";

playGame();
// loadGameScreen();
//loadSetupScreen();

/*
const player = new Player();
const enemy = new Player();
*/
//player.gameboard.placeShip(player.gameboard.ships[0], 0, 0, "horizontal");

//createGameBoard("setup-gameboard", true);
//createGameBoard("player-gameboard", false);
//createGameBoard("cpu-gameboard");
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
