import {
    loadGameScreen,
    loadSetupScreen,
    renderGameOverScreen,
    playExplosionSFX,
    playSinkingSFX,
} from "./dom";
import { Player } from "./player";
import { Enemy } from "./enemy";

let player;
let enemy;
let isPlayerTurn;

export function setupGame() {
    player = new Player();
    loadSetupScreen(player);
}

export function initialiseGame() {
    enemy = new Enemy();
    isPlayerTurn = true;

    enemy.gameboard.placeRandomFleet();

    loadGameScreen(player, enemy, isPlayerTurn);
}

export function handlePlayerMove(x, y) {
    if (!isPlayerTurn) return;

    enemy.gameboard.receiveAttack(x, y);

    if (enemy.gameboard.isHit(x, y)) {
        if (enemy.gameboard.board[x][y].isSunk()) {
            playSinkingSFX();
        } else {
            playExplosionSFX();
        }
    }

    isPlayerTurn = false;
    loadGameScreen(player, enemy, isPlayerTurn);

    if (enemy.gameboard.isAllSunk()) {
        setTimeout(() => renderGameOverScreen(true), 500);
    } else {
        setTimeout(handleEnemyMove, 700);
    }
}

function handleEnemyMove() {
    const move = enemy.makeMove(player.gameboard);

    if (move === "sunk") playSinkingSFX();
    else if (move === "hit") playExplosionSFX();

    isPlayerTurn = true;
    loadGameScreen(player, enemy, isPlayerTurn);

    if (player.gameboard.isAllSunk()) {
        setTimeout(() => renderGameOverScreen(false), 1000);
    }
}

export function handlePlaceShip(x, y, orientation) {
    player.gameboard.placeShip(player.gameboard.getNextShip(), x, y, orientation);
    loadSetupScreen(player);
}

export function handleRemoveShip(x, y) {
    if (player.gameboard.isHit(x, y)) {
        player.gameboard.removeShip(x, y);
        loadSetupScreen(player);
    }
}

export function handleRandomiseFleet() {
    player.gameboard.clear();
    player.gameboard.placeRandomFleet();
    loadSetupScreen(player);
}

export function handleClearBoard() {
    player.gameboard.clear();
    loadSetupScreen(player);
}
