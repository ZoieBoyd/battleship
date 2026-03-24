export function createGameBoard(id) {
    const gameboardDiv = document.querySelector("#" + id);
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement("button");
            cell.classList.add("cell");
            cell.addEventListener("click", () => {
                console.log("[" + i + ", " + j + "]");
            });
            gameboardDiv.appendChild(cell);
        }
    }
}
