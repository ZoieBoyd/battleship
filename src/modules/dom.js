import {
    handlePlayerMove,
    initialiseGame,
    handlePlaceShip,
    setupGame,
    handleRandomiseFleet,
    handleClearBoard,
    handleRemoveShip,
} from "./gameController";
import replayImage from "../images/replay.svg";
import randomImage from "../images/dice.svg";

const mainContentArea = document.querySelector("main");
const body = document.querySelector("body");

const explosionAudio = document.querySelector("#explosion-audio");
explosionAudio.volume = 0.1;

const bubblesAudio = document.querySelector("#bubbles-audio");

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
            const cell = createGridCell(i, j);

            if (!isEditable) {
                if (gameboard.board[i][j] != null) {
                    cell.classList.add("ship");
                }
            }

            if (gameboardDiv.id === "setup-gameboard") {
                enableSetupCellEvents(cell, gameboard, i, j);
            } else {
                enableGameplayCellEvents(cell, gameboard, i, j, isEditable);
            }

            gameboardDiv.appendChild(cell);
        }
    }
}

function createGridCell(x, y) {
    const cell = document.createElement("button");
    cell.classList.add("cell");
    cell.setAttribute("data-x", x);
    cell.setAttribute("data-y", y);

    return cell;
}

function enableSetupCellEvents(cell, gameboard, x, y) {
    const ship = gameboard.getNextShip();

    cell.addEventListener("click", () => {
        if (!ship) return;
        handlePlaceShip(x, y, currentOrientation);
    });

    cell.addEventListener("contextmenu", () => {
        handleRemoveShip(x, y);
    });

    cell.addEventListener("mouseenter", () => {
        onSetupCellHover(cell, gameboard, x, y, true);
    });

    cell.addEventListener("mouseleave", () => {
        onSetupCellHover(cell, gameboard, x, y, false);
    });
}

function enableGameplayCellEvents(cell, gameboard, x, y, isEditable) {
    if (gameboard.board[x][y] !== null && gameboard.board[x][y].isSunk()) {
        cell.classList.add("sunk");
    } else if (gameboard.misses.some(([boardX, boardY]) => boardX === x && boardY === y)) {
        cell.classList.add("miss");
    } else if (gameboard.hits.some(([boardX, boardY]) => boardX === x && boardY === y)) {
        cell.classList.add("hit");
    } else if (isEditable) {
        cell.classList.add("editable");

        cell.addEventListener("click", () => {
            handlePlayerMove(x, y);
        });
    }
}

function onSetupCellHover(cell, gameboard, x, y, isEntering) {
    const ship = gameboard.getNextShip();
    if (!ship) return;

    if (isEntering) {
        let shipCells = gameboard.calculateShipCoords(ship, x, y, currentOrientation);

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
    } else {
        const validatedCells = cell.parentElement.querySelectorAll(".valid, .invalid");
        for (const validatedCell of validatedCells) {
            validatedCell.classList.remove("valid", "invalid");
        }
    }
}

export function loadSetupScreen(player) {
    renderSetupScreen(player.gameboard);
    renderGameBoard("setup-gameboard", player.gameboard, false);
}

export function renderSetupScreen(gameboard) {
    mainContentArea.className = "setup-screen";

    const title = document.createElement("h2");
    title.textContent = "Place your fleet";
    title.style.gridArea = "title";

    const randomBtn = document.createElement("button");
    const randomImg = document.createElement("img");
    randomImg.src = randomImage;
    randomBtn.appendChild(randomImg);
    randomBtn.className = "img-btn";
    randomBtn.addEventListener("click", () => handleRandomiseFleet());

    const clearBtn = document.createElement("button");
    const clearImg = document.createElement("img");
    clearImg.src = replayImage;
    clearBtn.appendChild(clearImg);
    clearBtn.className = "img-btn";
    clearBtn.addEventListener("click", () => handleClearBoard());

    const btnContainer = document.createElement("div");
    btnContainer.append(randomBtn, clearBtn);
    btnContainer.id = "btn-container";
    btnContainer.style.gridArea = "buttons";

    const tip = document.createElement("p");
    tip.textContent = 'Tip: Press "R" to rotate';
    tip.style.gridArea = "tip";

    const setupGameboard = document.createElement("div");
    setupGameboard.className = "gameboard";
    setupGameboard.id = "setup-gameboard";
    setupGameboard.style.gridArea = "gameboard";

    const startBtn = document.createElement("button");
    startBtn.textContent = "Start";
    startBtn.style.gridArea = "start";
    startBtn.style.display = gameboard.numberOfShipsPlaced() < 5 ? "none" : "block";
    startBtn.addEventListener("click", () => initialiseGame());

    mainContentArea.replaceChildren(title, btnContainer, tip, setupGameboard, startBtn);
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

export function playExplosionSFX() {
    explosionAudio.currentTime = 0;
    explosionAudio.play();
}

export function playSinkingSFX() {
    bubblesAudio.currentTime = 0;
    bubblesAudio.play();
}
