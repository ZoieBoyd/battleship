import { handlePlayerMove } from "./gameController";

const mainContentArea = document.querySelector("main");

export function loadGameScreen(player, enemy, isPlayerTurn) {
    renderGameScreen();

    renderGameBoard("player-gameboard", player.gameboard, false);
    renderGameBoard("cpu-gameboard", enemy.gameboard, true);
}

function renderGameScreen() {
    mainContentArea.className = "game-screen";

    const playerTitle = document.createElement("h2");
    playerTitle.textContent = "Your Ships";

    const playerGameboard = document.createElement("div");
    playerGameboard.className = "gameboard";
    playerGameboard.id = "player-gameboard";

    const enemyTitle = document.createElement("h2");
    enemyTitle.textContent = "Enemy's Ships";

    const enemyGameboard = document.createElement("div");
    enemyGameboard.className = "gameboard";
    enemyGameboard.id = "cpu-gameboard";

    mainContentArea.replaceChildren(playerTitle, playerGameboard, enemyTitle, enemyGameboard);
}

export function renderGameBoard(id, gameboard, isEditable = true) {
    const gameboardDiv = document.querySelector("#" + id);
    gameboardDiv.replaceChildren();

    for (let i = 0; i < gameboard.size; i++) {
        for (let j = 0; j < gameboard.size; j++) {
            const cell = document.createElement("button");
            cell.classList.add("cell");

            if (!isEditable) {
                if (gameboard.board[i][j] != null) {
                    cell.classList.add("ship");
                }
            }
            if (gameboard.board[i][j] != null && gameboard.board[i][j].isSunk()) {
                cell.classList.add("sunk");
            } else if (gameboard.misses.some(([x, y]) => x === i && y === j)) {
                cell.classList.add("miss");
            } else if (gameboard.hits.some(([x, y]) => x === i && y === j)) {
                cell.classList.add("hit");
            } else if (isEditable) {
                cell.classList.add("editable");

                cell.addEventListener("click", () => {
                    handlePlayerMove(i, j);
                });
            }
            gameboardDiv.appendChild(cell);
        }
    }
}

/*export function loadSetupScreen() {
    renderSetupScreen();
    renderGameBoard("setup-gameboard");
}
*/

export function renderSetupScreen() {
    mainContentArea.className = "setup-screen";

    const title = document.createElement("h2");
    title.textContent = "Place your fleet";

    const tip = document.createElement("p");
    tip.textContent = 'Tip: Press "R" to rotate';

    const setupGameboard = document.createElement("div");
    setupGameboard.className = "gameboard";
    setupGameboard.id = "setup-gameboard";

    mainContentArea.append(title, tip, setupGameboard);
}
