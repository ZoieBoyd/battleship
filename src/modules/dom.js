import { handlePlayerMove, initialiseGame, handlePlaceShip, setupGame } from "./gameController";
import replayImage from "../images/replay.svg";

const mainContentArea = document.querySelector("main");
const body = document.querySelector("body");

if (mainContentArea.classList.contains("setup-screen")) {
}
let currentOrientation = "horizontal";
document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "r") {
        currentOrientation = currentOrientation === "horizontal" ? "vertical" : "horizontal";
    }
});

export function loadGameScreen(player, enemy) {
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
            cell.setAttribute("data-x", i);
            cell.setAttribute("data-y", j);

            if (!isEditable) {
                if (gameboard.board[i][j] != null) {
                    cell.classList.add("ship");
                }
            }

            cell.classList.add("editable");
            if (gameboardDiv.id === "setup-gameboard") {
                cell.addEventListener("click", () => {
                    handlePlaceShip(i, j, currentOrientation);
                });

                cell.addEventListener("mouseenter", () => {
                    let shipCells = gameboard.calculateShipCoords(
                        gameboard.ships[gameboard.numberOfShipsPlaced()],
                        i,
                        j,
                        currentOrientation,
                    );

                    const isValid = gameboard.isValidShipCoords(shipCells);

                    shipCells = shipCells.filter((coord) => gameboard.isMoveInBounds(coord));
                    for (const shipCell of shipCells) {
                        const cellBtn = document.querySelector(
                            `[data-x = "${shipCell[0]}"][data-y ="${shipCell[1]}"]`,
                        );

                        if (isValid) {
                            cellBtn.classList.add("valid");
                        } else {
                            cellBtn.classList.add("invalid");
                        }
                    }
                });

                cell.addEventListener("mouseleave", () => {
                    const validatedCells = gameboardDiv.querySelectorAll(".valid, .invalid");
                    for (const validatedCell of validatedCells) {
                        validatedCell.classList.remove("valid", "invalid");
                    }
                });
            } else {
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
            }

            gameboardDiv.appendChild(cell);
        }
    }
}

export function loadSetupScreen(player) {
    renderSetupScreen();
    renderGameBoard("setup-gameboard", player.gameboard, false);
}

export function renderSetupScreen() {
    mainContentArea.className = "setup-screen";

    const title = document.createElement("h2");
    title.textContent = "Place your fleet";

    const tip = document.createElement("p");
    tip.textContent = 'Tip: Press "R" to rotate';

    const setupGameboard = document.createElement("div");
    setupGameboard.className = "gameboard";
    setupGameboard.id = "setup-gameboard";

    mainContentArea.replaceChildren(title, tip, setupGameboard);
}

export function renderGameOverScreen(isWinner) {
    mainContentArea.className = "game-over-screen";

    const text = document.createElement("h1");
    text.textContent = isWinner ? "Victory" : "Defeat";

    const replayBtn = document.createElement("button");
    const replayBtnImg = document.createElement("img");
    replayBtnImg.src = replayImage;
    replayBtn.className = "img-btn";
    replayBtn.appendChild(replayBtnImg);
    replayBtn.addEventListener("click", () => setupGame());

    mainContentArea.replaceChildren(text, replayBtn);
}
