import { loadGameScreen } from "./dom";
import { Player } from "./player";

export function playGame() {
    const player = new Player();
    const enemy = new Player();
    loadGameScreen(player, enemy);
    let hasWinner = false;
    /*
    while (!hasWinner) {
        if (checkForWinner(player, enemy)) {
            hasWinner = true;
        }
    } */
}

function checkForWinner(p1, p2) {
    return p1.gameboard.isAllSunk() || p2.gameboard.isAllSunk();
}
