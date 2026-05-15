import { loadGameScreen, renderGameOverScreen } from "./dom";
import { Player } from "./player";

let player;
let enemy;
let isPlayerTurn;
let enemyTargets;
let currentEnemyHits;

export function initialiseGame() {
    player = new Player();
    enemy = new Player();
    isPlayerTurn = true;
    enemyTargets = [];
    currentEnemyHits = [];

    player.gameboard.placeRandomFleet();
    enemy.gameboard.placeRandomFleet();

    loadGameScreen(player, enemy, isPlayerTurn);
}

export function handlePlayerMove(x, y) {
    if (!isPlayerTurn) return;

    enemy.gameboard.receiveAttack(x, y);

    isPlayerTurn = false;
    loadGameScreen(player, enemy, isPlayerTurn);

    if (enemy.gameboard.isAllSunk()) {
        setTimeout(() => renderGameOverScreen(true), 500);
    } else {
        setTimeout(handleEnemyMove, 500);
    }
}

function handleEnemyMove() {
    if (enemyTargets.length === 0) {
        let randMove = player.gameboard.getRandMove();
        while (player.gameboard.hasBeenAttacked(randMove.x, randMove.y)) {
            randMove = player.gameboard.getRandMove();
        }
        player.gameboard.receiveAttack(randMove.x, randMove.y);
        if (player.gameboard.isHit(randMove.x, randMove.y)) {
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
    } else {
        let attack = enemyTargets.shift();
        while (player.gameboard.hasBeenAttacked(attack[0], attack[1])) {
            attack = enemyTargets.shift();
        }
        player.gameboard.receiveAttack(attack[0], attack[1]);
        if (player.gameboard.isHit(attack[0], attack[1])) {
            currentEnemyHits.push([attack[0], attack[1]]);
            if (player.gameboard.board[attack[0]][attack[1]].isSunk()) {
                enemyTargets = [];
                currentEnemyHits = [];
            } else {
                if (currentEnemyHits[0][0] === attack[0]) {
                    // horizontal
                    const potentialMoves = [
                        [attack[0], attack[1] - 1], // left
                        [attack[0], attack[1] + 1], // right
                    ];

                    enemyTargets.unshift(
                        ...potentialMoves.filter((coords) =>
                            player.gameboard.isMoveInBounds(coords),
                        ),
                    );
                } else {
                    // vertical
                    const potentialMoves = [
                        [attack[0] - 1, attack[1]], // up
                        [attack[0] + 1, attack[1]], // down
                    ];

                    enemyTargets.unshift(
                        ...potentialMoves.filter((coords) =>
                            player.gameboard.isMoveInBounds(coords),
                        ),
                    );
                }
            }
        }
    }

    isPlayerTurn = true;
    loadGameScreen(player, enemy, isPlayerTurn);

    if (player.gameboard.isAllSunk()) {
        setTimeout(() => renderGameOverScreen(false), 500);
    }
}
