import { Player } from "./player";

export class Enemy extends Player {
    constructor() {
        super();
        this.targets = new Array();
        this.currentHits = new Array();
    }

    makeMove(playerGameboard) {
        if (this.targets.length === 0) {
            return this.search(playerGameboard);
        } else {
            return this.hunt(playerGameboard);
        }
    }

    search(playerGameboard) {
        let randMove = playerGameboard.getRandMove();
        while (playerGameboard.hasBeenAttacked(randMove.x, randMove.y)) {
            randMove = playerGameboard.getRandMove();
        }
        playerGameboard.receiveAttack(randMove.x, randMove.y);

        if (playerGameboard.isHit(randMove.x, randMove.y)) {
            this.currentHits.push([randMove.x, randMove.y]);

            const potentialMoves = [
                [randMove.x - 1, randMove.y],
                [randMove.x + 1, randMove.y],
                [randMove.x, randMove.y - 1],
                [randMove.x, randMove.y + 1],
            ];

            this.targets.unshift(
                ...potentialMoves.filter((coord) => playerGameboard.isMoveInBounds(coord)),
            );
        }
    }

    hunt(playerGameboard) {
        let attack = this.targets.shift();
        while (playerGameboard.hasBeenAttacked(attack[0], attack[1])) {
            attack = this.targets.shift();
        }
        playerGameboard.receiveAttack(attack[0], attack[1]);
        if (playerGameboard.isHit(attack[0], attack[1])) {
            this.currentHits.push([attack[0], attack[1]]);

            if (playerGameboard.board[attack[0]][attack[1]].isSunk()) {
                this.targets = [];
                this.currentHits = [];
                return "sunk";
            } else {
                if (this.currentHits[0][0] === attack[0]) {
                    const potentialMoves = [
                        [attack[0], attack[1] - 1], // left
                        [attack[0], attack[1] + 1], // right
                    ];

                    this.targets.unshift(
                        ...potentialMoves.filter((coords) =>
                            playerGameboard.isMoveInBounds(coords),
                        ),
                    );
                } else {
                    // vertical
                    const potentialMoves = [
                        [attack[0] - 1, attack[1]], // up
                        [attack[0] + 1, attack[1]], // down
                    ];

                    this.targets.unshift(
                        ...potentialMoves.filter((coords) =>
                            playerGameboard.isMoveInBounds(coords),
                        ),
                    );
                }
                return "hit";
            }
        }
        return "miss";
    }
}
