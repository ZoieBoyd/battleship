import {
    loadGameScreen,
    loadSetupScreen,
    renderGameOverScreen,
    playExplosionSFX,
    playSinkingSFX,
} from "./dom";
import { Player } from "./player";

let player;
let enemy;
let isPlayerTurn;
let enemyTargets;
let currentEnemyHits;

export function setupGame() {
    player = new Player();
    loadSetupScreen(player);
}

export function initialiseGame() {
    enemy = new Player();
    isPlayerTurn = true;
    enemyTargets = [];
    currentEnemyHits = [];

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
    if (enemyTargets.length === 0) {
        searchMode();
    } else {
        huntMode();
    }

    isPlayerTurn = true;
    loadGameScreen(player, enemy, isPlayerTurn);

    if (player.gameboard.isAllSunk()) {
        setTimeout(() => renderGameOverScreen(false), 1000);
    }
}

function searchMode() {
    let randMove = player.gameboard.getRandMove();
    while (player.gameboard.hasBeenAttacked(randMove.x, randMove.y)) {
        randMove = player.gameboard.getRandMove();
    }
    player.gameboard.receiveAttack(randMove.x, randMove.y);
    if (player.gameboard.isHit(randMove.x, randMove.y)) {
        playExplosionSFX();
        currentEnemyHits.push([randMove.x, randMove.y]);

        const potentialMoves = [
            [randMove.x - 1, randMove.y],
            [randMove.x + 1, randMove.y],
            [randMove.x, randMove.y - 1],
            [randMove.x, randMove.y + 1],
        ];
        enemyTargets.unshift(
            ...potentialMoves.filter((coords) => player.gameboard.isMoveInBounds(coords)),
        );
    }
}

function huntMode() {
    let attack = enemyTargets.shift();
    while (player.gameboard.hasBeenAttacked(attack[0], attack[1])) {
        attack = enemyTargets.shift();
    }
    player.gameboard.receiveAttack(attack[0], attack[1]);
    if (player.gameboard.isHit(attack[0], attack[1])) {
        currentEnemyHits.push([attack[0], attack[1]]);
        if (player.gameboard.board[attack[0]][attack[1]].isSunk()) {
            playSinkingSFX();
            enemyTargets = [];
            currentEnemyHits = [];
        } else {
            playExplosionSFX();
            if (currentEnemyHits[0][0] === attack[0]) {
                // horizontal
                const potentialMoves = [
                    [attack[0], attack[1] - 1], // left
                    [attack[0], attack[1] + 1], // right
                ];

                enemyTargets.unshift(
                    ...potentialMoves.filter((coords) => player.gameboard.isMoveInBounds(coords)),
                );
            } else {
                // vertical
                const potentialMoves = [
                    [attack[0] - 1, attack[1]], // up
                    [attack[0] + 1, attack[1]], // down
                ];

                enemyTargets.unshift(
                    ...potentialMoves.filter((coords) => player.gameboard.isMoveInBounds(coords)),
                );
            }
        }
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
