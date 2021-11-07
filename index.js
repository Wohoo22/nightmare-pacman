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
let ghostKillerFruitDuration = 5000;
let ghostSpeed = 100;
let pacmanSpeed = 90;
let ghostDelayBeforeRespawn = 4000;
const configFormDefaultValues = {
    ghostKillerFruitDuration: 5,
    ghostDelayBeforeRespawn: 4,
    pacmanSpeed: 110,
    ghostSpeed: 100
}

// logic configuration
const pacmanPathQueueSize = 5
const ghostPathQueueSize = 10

// map info, do not modify
const matrixLineLength = 28;
const normalFruitCount = 238;

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
    1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 0, 0, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 1, 2, 2, 0, 0, 2, 2, 1, 4, 0, 0, 0, 4, 4, 4, 4, 4, 4,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
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

function setGhostKillerFruitDuration() {
    const userVal = document.getElementById("ghostKillerFruitDuration").value
    if (userVal < 0) {
        alert("Power pellet duration must be greater than or equal to 0")
        return
    }
    if (userVal != undefined)
        ghostKillerFruitDuration = userVal * 1000
}

function setGhostDelayBeforeRespawn() {
    const userVal = document.getElementById("ghostDelayBeforeRespawn").value
    if (userVal < 0) {
        alert("Ghost respawn duration must be greater than or equal to 0")
        return
    }
    if (userVal != undefined)
        ghostDelayBeforeRespawn = userVal * 1000
}

function setGhostSpeed() {
    const userVal = document.getElementById("ghostSpeed").value
    if (userVal <= 0 || userVal > 200) {
        alert("Ghost speed must be in the range 1-200")
        return
    }
    if (userVal != undefined)
        ghostSpeed = 201 - userVal
}

function setPacmanSpeed() {
    const userVal = document.getElementById("pacmanSpeed").value
    if (userVal <= 0 || userVal > 200) {
        alert("Pacman speed must be in the range 1-200")
        return
    }
    if (userVal != undefined)
        pacmanSpeed = 201 - userVal
}

function setConfig() {
    setGhostKillerFruitDuration()
    setGhostDelayBeforeRespawn()
    setGhostSpeed()
    setPacmanSpeed()
}

function resetConfig() {
    document.getElementById("ghostKillerFruitDuration").value = configFormDefaultValues.ghostKillerFruitDuration
    document.getElementById("ghostDelayBeforeRespawn").value = configFormDefaultValues.ghostDelayBeforeRespawn
    document.getElementById("ghostSpeed").value = configFormDefaultValues.ghostSpeed
    document.getElementById("pacmanSpeed").value = configFormDefaultValues.pacmanSpeed
    setConfig()
}

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

const intervals = []
function stopIntervals() {
    for (const interval of intervals) {
        clearInterval(interval)
    }
    intervals.length = 0
}

function getMode() {
    const modes = document.getElementsByName("level")
    for (const mode of modes) {
        if (mode.checked) {
            return mode.value
        }
    }
    modes[0].checked = true
    return modes[0].value
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

    const checkGameOver = () => {
        for (const ghost of ghosts) {
            if (!ghost.isScared
                && ghost.currentIndex === pacmanIndex) {
                gameEnded = true
                document.removeEventListener('keyup', movePacmanListener)
                alert("YOU LOSE :((((")
                stopIntervals();
                window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ?rel=0&autoplay=1', '_blank');
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

        while (lastPacmanIndexes.length > pacmanPathQueueSize)
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
                }, ghostKillerFruitDuration)
            }
        }
        ghostKillerFruitEaten();
        checkGameOver()
        const checkWin = () => {
            if (score === normalFruitCount) {
                gameEnded = true
                document.removeEventListener('keyup', movePacmanListener)
                alert("YOU WIN !!!")
                stopIntervals();
            }
        }
        checkWin()
    }

    const movePacmanListener = (e) => {
        keyCode = e.keyCode;
    }
    document.addEventListener('keyup', movePacmanListener)
    intervals.push(setInterval(function () {
        if (keyCode === Keycode.LEFT || keyCode === Keycode.RIGHT)
            gameStarted = true
        if (gameEnded || !gameStarted)
            return
        movePacman()
    }, pacmanSpeed))

    // my little ghosts <3
    class Ghost {
        constructor(className, currentIndex) {
            this.className = className;
            this.currentIndex = currentIndex;
            this.startIndex = currentIndex;
            this.isScared = false;
            this.isSpawning = false;
            this.previousIndexes = []
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
        const move = () => {
            ghost.isSpawning = false
            let previousIndex = ghost.currentIndex;
            let nextIndex = findOptimalGhostDir(pacmanIndex, ghost, graph);
            while (ghost.previousIndexes.length > ghostPathQueueSize)
                ghost.previousIndexes.shift()
            if (!ghost.previousIndexes.includes(nextIndex))
                ghost.previousIndexes.push(nextIndex)
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
        intervals.push(setInterval(() => {
            if (gameEnded || ghost.isSpawning)
                return;
            move()
        }, ghostSpeed));
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
    const rnd = (up) => {
        return Math.floor(Math.random() * (up + 1));
    }
    const dist = dijkstra(graph, pacmanIndex);
    const neighborDist = []
    for (const neightbor of graph[ghost.currentIndex].neighbors) {
        neighborDist.push({
            index: neightbor,
            dist: dist[neightbor]
        })
    }
    neighborDist.sort((x, y) => {
        if (x.dist < y.dist) return -1;
        if (x.dist > y.dist) return 1;
        return 0;
    })
    let subtract = 0
    switch (getMode()) {
        case "easy":
            subtract = 0;
            break;
        case "medium":
            subtract = rnd(2);
            break
        case "nightmare":
            subtract = rnd(1);
            break
        default:
            break;
    }
    let ran = rnd(neighborDist.length - 1 - subtract);
    if (ran < 0) ran = 0;
    let counter = 0
    while (ghost.previousIndexes.includes(neighborDist[ran].index)
        && counter < 10) {
        ran = rnd(neighborDist.length - 1 - subtract);
        if (ran < 0) ran = 0;
        counter++;
    }
    return neighborDist[ran].index;
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
            (Math.abs(neighbors[0] - neighbors[1]) === matrixLineLength * 2) // same column
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

function restartGame() {
    stopIntervals();
    const grid = document.querySelector('.grid');
    grid.innerHTML = ""
    setConfig()
    startGame()
}

document.addEventListener('DOMContentLoaded', () => {
    hideButtons()
    resetConfig()
    startGame();
})

function hideButtons() {
    document.getElementById('button-container').style.display = 'none'
}

function showButtons() {
    document.getElementById('button-container').style.display = 'inline-block'
}

function go(s) {
    let keyCode
    switch (s) {
        case 'u':
            keyCode = Keycode.UP
            break
        case 'd':
            keyCode = Keycode.DOWN
            break
        case 'l':
            keyCode = Keycode.LEFT
            break
        case 'r':
            keyCode = Keycode.RIGHT
            break
    }
    var event = new CustomEvent("keyup", {});
    event.keyCode = keyCode
    document.dispatchEvent(event);
}

// prevent scroll
var keys = {};
window.addEventListener("keydown",
    function (e) {
        keys[e.keyCode] = true;
        switch (e.keyCode) {
            case 37: case 39: case 38: case 40: // Arrow keys
            case 32: e.preventDefault(); break; // Space
            default: break; // do not block other keys
        }
    },
    false);
window.addEventListener('keyup',
    function (e) {
        keys[e.keyCode] = false;
    },
    false);