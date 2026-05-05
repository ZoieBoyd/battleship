import { loadGameScreen } from "./dom";
import { Player } from "./player";

export function playGame() {
    const player = new Player();
    const enemy = new Player();
    let currentPlayer = player; // player's turn first

    player.gameboard.placeRandomFleet();
    enemy.gameboard.placeRandomFleet();

    loadGameScreen(player, enemy);

    // while (!isWinner(player, enemy)) {
    // play game
    //}
    // display winner screen
}

function isWinner(p1, p2) {
    return p1.gameboard.isAllSunk() || p2.gameboard.isAllSunk();
}
