// @author: quanvda, November 4th, 2021

const cssClassConfig = {
    NORMAL_FRUIT: 'normal-fruit',
    GHOST_KILLER_FRUIT: 'ghost-killer-fruit',
    WALL: 'wall',
    GHOST_SPAWN_POINT: 'ghost-spawn-point',
    PACMAN: 'pac-man',
    GHOST: 'ghost',
    PINK_GHOST: 'pink-ghost',
    BLUE_GHOST: 'blue-ghost',
    ORANGE_GHOST: 'orange-ghost',
    GREEN_GHOST: 'green-ghost',
    SCARED_GHOST: 'scared-ghost'
}

// config
const ghostKillerFruitTime = 5000;
const ghostSpeed = 100;
const pacmanSpeed = 90;
const ghostDelayBeforeRespawn = 2000;

const matrixLineLength = 28;
const normalFruitCount = 292;

const pattern = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 3, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 3, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 2, 2, 2, 2, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 0, 2, 2, 2, 2, 0, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 1, 0, 2, 2, 2, 2, 0, 1, 4, 0, 0, 0, 4, 4, 4, 4, 4, 4,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 0, 0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 1,
    1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
    1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
];

function createMatrix1D() {
    const grid = document.querySelector('.grid');
    const matrix1D = [];
    for (var i = 0; i < pattern.length; i++) {
        const matrixItem = document.createElement('div');
        grid.appendChild(matrixItem);
        matrix1D.push(matrixItem);
        switch (pattern[i]) {
            case 0:
                matrix1D[i].classList.add(cssClassConfig.NORMAL_FRUIT);
                break;
            case 1:
                matrix1D[i].classList.add(cssClassConfig.WALL);
                break;
            case 2:
                matrix1D[i].classList.add(cssClassConfig.GHOST_SPAWN_POINT);
                break;
            case 3:
                matrix1D[i].classList.add(cssClassConfig.GHOST_KILLER_FRUIT);
                break;
        }
    }
    return matrix1D;
}


function createPacman(matrix1D) {
    const pacmanIndex = 490;
    matrix1D[pacmanIndex].classList.add(cssClassConfig.PACMAN);
    return pacmanIndex;
}

function validMove(nextIndex, matrix1D) {
    return nextIndex >= 0 &&
        nextIndex < matrix1D.length &&
        !matrix1D[nextIndex].classList.contains(cssClassConfig.WALL);
}

const Keycode = {
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40
}


function startGame() {
    // create map
    const matrix1D = createMatrix1D();

    // score properties
    let score = 0;
    const scoreDocument = document.getElementById('score')
    scoreDocument.innerHTML = score;

    // initialize pacman
    let pacmanIndex = createPacman(matrix1D);

    // checker functions
    const checkGameOver = () => {
        for (const ghost of ghosts) {
            if (!ghost.isScared
                && ghost.currentIndex === pacmanIndex) {
                gameEnded = true
                document.removeEventListener('keyup', movePacmanListener)
                alert("YOU LOSE :((((")
                return
            }
        }
        const scaredGhosts = []
        for (const ghost of ghosts) {
            if (ghost.isScared
                && ghost.currentIndex === pacmanIndex) {
                scaredGhosts.push(ghost);
            }
        }
        resetScaredGhost(scaredGhosts);
    }

    // game state
    let gameEnded = false
    let gameStarted = false

    // create graph for running algorithm
    const graph = buildGraph(matrix1D);

    // handle pacman movement
    let keyCode = -1
    let lastLeftRightKeyCode = Keycode.RIGHT;
    let lastUpDownKeyCode = Keycode.DOWN;
    const lastPacmanIndexes = [];
    const movePacman = () => {
        let lastIndex = pacmanIndex;
        let nextIndex = pacmanIndex
        switch (keyCode) {
            case Keycode.LEFT:
                nextIndex = pacmanIndex - 1;
                if (pacmanIndex - 1 == 363)
                    nextIndex = 391;
                break;
            case Keycode.UP:
                nextIndex = pacmanIndex - matrixLineLength;
                break;
            case Keycode.RIGHT:
                nextIndex = pacmanIndex + 1;
                if (pacmanIndex + 1 == 392)
                    nextIndex = 364;
                break
            case Keycode.DOWN:
                nextIndex = pacmanIndex + matrixLineLength;
                break;
        }
        let chosenKeycode
        if (validMove(nextIndex, matrix1D)) {
            pacmanIndex = nextIndex;
            chosenKeycode = keyCode
        } else {
            const dir = findOptimalPacmanDir(pacmanIndex, graph, keyCode, lastLeftRightKeyCode, lastUpDownKeyCode, lastPacmanIndexes)
            pacmanIndex = dir.index
            chosenKeycode = dir.keyCode
            if (dir.changeKeyCode)
                keyCode = dir.changeKeyCode
        }

        while(lastPacmanIndexes.length > 5)
            lastPacmanIndexes.shift()
        if (!lastPacmanIndexes.includes(pacmanIndex))
            lastPacmanIndexes.push(pacmanIndex);
        

        switch (chosenKeycode) {
            case Keycode.RIGHT:
            case Keycode.LEFT:
                lastLeftRightKeyCode = chosenKeycode;
                break;
            case Keycode.UP:
            case Keycode.DOWN:
                lastUpDownKeyCode = chosenKeycode;
                break;
        }
        matrix1D[lastIndex].classList.remove(cssClassConfig.PACMAN);
        matrix1D[pacmanIndex].classList.add(cssClassConfig.PACMAN);
        const normalFruitEaten = () => {
            if (matrix1D[pacmanIndex].classList.contains(cssClassConfig.NORMAL_FRUIT)) {
                matrix1D[pacmanIndex].classList.remove(cssClassConfig.NORMAL_FRUIT);
                score++;
                scoreDocument.innerHTML = score;
            }
        }
        normalFruitEaten();
        const ghostKillerFruitEaten = () => {
            if (matrix1D[pacmanIndex].classList.contains(cssClassConfig.GHOST_KILLER_FRUIT)) {
                matrix1D[pacmanIndex].classList.remove(cssClassConfig.GHOST_KILLER_FRUIT);
                for (ghost of ghosts)
                    ghost.isScared = true
                setTimeout(() => {
                    for (ghost of ghosts)
                        ghost.isScared = false
                }, ghostKillerFruitTime)
            }
        }
        ghostKillerFruitEaten();
        checkGameOver()
        const checkWin = () => {
            if (score === normalFruitCount) {
                gameEnded = true
                document.removeEventListener('keyup', movePacmanListener)
                alert("YOU WIN !!!")
            }
        }
        checkWin()
    }

    const movePacmanListener = (e) => {
        keyCode = e.keyCode;
        // movePacman();
    }
    document.addEventListener('keyup', movePacmanListener)
    setInterval(function () {
        if (keyCode === Keycode.LEFT || keyCode === Keycode.RIGHT)
            gameStarted = true
        if (gameEnded || !gameStarted)
            return
        movePacman()
    }, pacmanSpeed)

    // my little ghosts <3
    class Ghost {
        constructor(className, currentIndex) {
            this.className = className;
            this.currentIndex = currentIndex;
            this.startIndex = currentIndex;
            this.isScared = false;
            this.isSpawning = false;
        }
    }
    const ghosts = [
        new Ghost(cssClassConfig.PINK_GHOST, 348),
        new Ghost(cssClassConfig.BLUE_GHOST, 376),
        new Ghost(cssClassConfig.ORANGE_GHOST, 351),
        new Ghost(cssClassConfig.GREEN_GHOST, 379)
    ]

    // draw ghosts
    for (const ghost of ghosts) {
        matrix1D[ghost.currentIndex].classList.add(ghost.className);
        matrix1D[ghost.currentIndex].classList.add(cssClassConfig.GHOST);
    }

    // handle ghost movement
    const moveGhost = (ghost) => {
        const move = (dir) => {
            ghost.isSpawning = false
            let previousIndex = ghost.currentIndex;
            let nextIndex = findOptimalGhostDir(pacmanIndex, ghost, graph);
            if (!validMove(nextIndex, matrix1D))
                return false;
            const haveAnotherScaredGhost = (index) => {
                for (const aGhost of ghosts) {
                    if (aGhost !== ghost
                        && aGhost.currentIndex === index
                        && aGhost.isScared) {
                        return true;
                    }
                }
                return false;
            }
            const haveAnotherGhost = (index) => {
                for (const aGhost of ghosts) {
                    if (aGhost !== ghost
                        && aGhost.currentIndex === index) {
                        return true;
                    }
                }
                return false;
            }
            matrix1D[previousIndex].classList.remove(ghost.className);
            if (!haveAnotherGhost(previousIndex))
                matrix1D[previousIndex].classList.remove(cssClassConfig.GHOST);
            if (!haveAnotherScaredGhost(previousIndex))
                matrix1D[previousIndex].classList.remove(cssClassConfig.SCARED_GHOST);
            matrix1D[nextIndex].classList.add(ghost.className);
            matrix1D[nextIndex].classList.add(cssClassConfig.GHOST);
            if (ghost.isScared)
                matrix1D[nextIndex].classList.add(cssClassConfig.SCARED_GHOST);
            ghost.currentIndex = nextIndex
            checkGameOver()
            return true;
        }
        setInterval(() => {
            if (gameEnded || ghost.isSpawning)
                return;
            move()
        }, ghostSpeed);
    }
    const startGhost = () => {
        if (gameStarted) {
            for (const ghost of ghosts)
                moveGhost(ghost);
        } else {
            setTimeout(startGhost, 100)
        }
    }
    startGhost()
    const resetScaredGhost = (ghosts) => {
        for (const ghost of ghosts) {
            ghost.isScared = false
            matrix1D[ghost.currentIndex].classList.remove(ghost.className);
            matrix1D[ghost.currentIndex].classList.remove(cssClassConfig.GHOST);
            matrix1D[ghost.currentIndex].classList.remove(cssClassConfig.SCARED_GHOST);
            matrix1D[ghost.startIndex].classList.add(ghost.className);
            matrix1D[ghost.startIndex].classList.add(cssClassConfig.GHOST);
            ghost.currentIndex = ghost.startIndex;
            ghost.isSpawning = true
            setTimeout(() => {
                ghost.isSpawning = false
            }, ghostDelayBeforeRespawn);
        }
    }
}

// build graph from matrix
function buildGraph(matrix) {
    class Node {
        constructor(index) {
            this.index = index;
            this.neighbors = [];
        }
    }
    const nodes = [];
    for (let i = 0; i < pattern.length; i++) {
        nodes.push(new Node(i));
    }
    for (const node of nodes) {
        if (validMove(node.index + 1, matrix))
            node.neighbors.push(node.index + 1);
        if (validMove(node.index - 1, matrix))
            node.neighbors.push(node.index - 1);
        if (validMove(node.index + matrixLineLength, matrix))
            node.neighbors.push(node.index + matrixLineLength);
        if (validMove(node.index - matrixLineLength, matrix))
            node.neighbors.push(node.index - matrixLineLength);
        if (node.index - 1 == 363)
            node.neighbors.push(391);
        if (node.index + 1 == 392)
            node.neighbors.push(364);
    }
    return nodes;
}

function findOptimalGhostDir(pacmanIndex, ghost, graph) {
    const dist = dijkstra(graph, pacmanIndex);
    let mnDist = Number.MAX_SAFE_INTEGER;
    let mnNeighbor = -1;
    for (const neightbor of graph[ghost.currentIndex].neighbors) {
        if (dist[neightbor] < mnDist) {
            mnDist = dist[neightbor];
            mnNeighbor = neightbor;
        }
    }
    return mnNeighbor;
}

function findOptimalPacmanDir(pacmanIndex, graph, keyCode, lastLeftRightKeyCode, lastUpDownKeyCode, lastPacmanIndexes) {
    const neighbors = graph[pacmanIndex].neighbors;
    const left = pacmanIndex - 1;
    const right = pacmanIndex + 1;
    const up = pacmanIndex - matrixLineLength;
    const down = pacmanIndex + matrixLineLength;

    // corner case
    if (neighbors.length === 2
        &&  // not in the same line
        !(
            (Math.abs(neighbors[0] - neighbors[1]) === matrixLineLength * 2)
            || (Math.abs(neighbors[0] - neighbors[1]) === 2) // same line
        )
    ) {
        let index = lastPacmanIndexes.includes(neighbors[0]) ? neighbors[1] : neighbors[0];
        let rKeyCode = -1
        switch (index) {
            case pacmanIndex + 1:
                rKeyCode = Keycode.RIGHT
                break
            case pacmanIndex - 1:
                rKeyCode = Keycode.LEFT
                break
            case pacmanIndex + matrixLineLength:
                rKeyCode = Keycode.DOWN
                break
            case pacmanIndex - matrixLineLength:
                rKeyCode = Keycode.UP
                break
        }
        const res = {
            index: index,
            keyCode: rKeyCode,
            changeKeyCode: rKeyCode
        }
        // console.log(res)
        // console.log('pac',pacmanIndex)
        // console.log('neigh',neighbors)
        // console.log('lst', lastPacmanIndex)
        return res;
    }

    let result
    switch (keyCode) {
        case Keycode.LEFT: // left
        case Keycode.RIGHT: // right
            if (lastUpDownKeyCode === Keycode.UP
                && neighbors.includes(up))
                return { index: up, keyCode: Keycode.UP };
            if (lastUpDownKeyCode === Keycode.DOWN
                && neighbors.includes(down))
                return { index: down, keyCode: Keycode.DOWN };
            result = lastUpDownKeyCode === Keycode.UP ?
                { index: down, keyCode: Keycode.DOWN } :
                { index: up, keyCode: Keycode.UP };
            break
        case Keycode.UP: // up
        case Keycode.DOWN: // down
            if (lastLeftRightKeyCode === Keycode.LEFT
                && neighbors.includes(left))
                return { index: left, keyCode: Keycode.LEFT };
            if (lastLeftRightKeyCode === Keycode.RIGHT
                && neighbors.includes(right))
                return { index: right, keyCode: Keycode.RIGHT };
            result = lastLeftRightKeyCode === Keycode.LEFT ?
                { index: right, keyCode: Keycode.RIGHT } :
                { index: left, keyCode: Keycode.LEFT };
            break
    }
    result = neighbors.includes(result.index) ? result : { index: pacmanIndex, keyCode: -1 };;
    return result;
}

function minDistance(dist, sptSet, V) {
    let min = Number.MAX_VALUE;
    let min_index = -1;
    for (let v = 0; v < V; v++) {
        if (sptSet[v] == false && dist[v] <= min) {
            min = dist[v];
            min_index = v;
        }
    }
    return min_index;
}


function dijkstra(graph, src) {
    const V = graph.length;

    let dist = new Array(V);
    let sptSet = new Array(V);

    for (let i = 0; i < V; i++) {
        dist[i] = Number.MAX_VALUE;
        sptSet[i] = false;
    }
    dist[src] = 0;
    for (let count = 0; count < V - 1; count++) {
        let u = minDistance(dist, sptSet, V);
        sptSet[u] = true;
        for (let v = 0; v < V; v++) {
            if (!sptSet[v]
                && graph[u].neighbors.includes(v)
                && dist[u] != Number.MAX_VALUE &&
                dist[u] + 1 < dist[v]) {
                dist[v] = dist[u] + 1;
            }
        }
    }
    return dist;
}

document.addEventListener('DOMContentLoaded', () => {
    startGame();
})
