import { Obstacle, GhostObstacle } from "./classes.js";
import { obstacles, canvas, addObstacle, spawnEnemy, randomNumber, ghostObstacles } from "./javascript.js";

const blockImg = new Image();
const crateImg = new Image();
const secondEnemyImg = new Image();
const placeholder = new Image();



blockImg.src = 'assets/blocks.svg'
crateImg.src = 'assets/crate.png'
secondEnemyImg.src = 'assets/secondEnemy.png'
placeholder.src = 'assets/placeholder.png'


function buildCratePile(relativePileX) {
    addObstacle(relativePileX, canvas.height - 50, 50, 50, 4, crateImg)
    addObstacle(relativePileX + 50, canvas.height - 50, 50, 50, 4, blockImg)
    addObstacle(relativePileX + 50, canvas.height - 100, 50, 50, 4, crateImg)
    addObstacle(relativePileX + 100, canvas.height - 50, 50, 50, 4, crateImg)
    addObstacle(relativePileX + 100, canvas.height - 100, 50, 50, 4, crateImg)
}
function buildTower(relativeTowerX) {
    // addObstacle(relativeTowerX, canvas.height - 50, 50, 50, 4, blockImg)
    // addObstacle(relativeTowerX + 50, canvas.height - 50, 50, 50, 4, blockImg)
    // addObstacle(relativeTowerX + 100, canvas.height - 50, 50, 50, 4, blockImg)
    ghostObstacles.push(new GhostObstacle(relativeTowerX, canvas.height - 50, 50, 50, 4, placeholder))
    ghostObstacles.push(new GhostObstacle(relativeTowerX + 50, canvas.height - 50, 50, 50, 4, placeholder))
    ghostObstacles.push(new GhostObstacle(relativeTowerX + 100, canvas.height - 50, 50, 50, 4, placeholder))
    addObstacle(relativeTowerX, canvas.height - 100, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX, canvas.height - 150, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX, canvas.height - 200, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX, canvas.height - 250, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX, canvas.height - 300, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX + 50, canvas.height - 100, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX + 50, canvas.height - 150, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX + 50, canvas.height - 200, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX + 50, canvas.height - 250, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX + 50, canvas.height - 300, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX + 100, canvas.height - 100, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX + 100, canvas.height - 150, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX + 100, canvas.height - 200, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX + 100, canvas.height - 250, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX + 100, canvas.height - 300, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX - 50, canvas.height - 350, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX, canvas.height - 350, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX + 50, canvas.height - 350, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX + 100, canvas.height - 350, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX + 150, canvas.height - 350, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX - 50, canvas.height - 400, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX + 50, canvas.height - 400, 50, 50, 4, blockImg)
    addObstacle(relativeTowerX + 150, canvas.height - 400, 50, 50, 4, blockImg)
    obstacles.push(new Obstacle(relativeTowerX - 25, canvas.height - 300, 25, 25, 4, blockImg))
    obstacles.push(new Obstacle(relativeTowerX + 150, canvas.height - 300, 25, 25, 4, blockImg))
}

function buildSmallArena(x) {
    addObstacle(x, canvas.height - 50, 50, 50, 4, blockImg)
    for (let i = 0; i < 15; i++) {
        addObstacle(x + (50 * i), canvas.height - 50, 50, 50, 4, blockImg)
    }
    for (let i = 0; i < 5; i++) {
        addObstacle(x, canvas.height - (50 * i ), 50, 50, 4, blockImg)
    }
    for (let i = 0; i < 5; i++) {
        addObstacle(x + (50 * 15), canvas.height - (50 * i ), 50, 50, 4, blockImg)
    }
    spawnEnemy(x + (50 * 7), 100, 100, 350, 4, secondEnemyImg, 150)
    addObstacle(x + (50 * 8), canvas.height - 100, 50, 50, 4, blockImg)
    addObstacle(x + (50 * 5), canvas.height - 100, 50, 50, 4, blockImg)
}

export function buildMapOne() {
    // addObstacle(450, canvas.height - 50, 50, 50, 4, crateImg)d
    // addObstacle(400, canvas.height - 50, 50, 50, 4, crateImg)
    // addObstacle(450, canvas.height - 100, 50, 50, 4, blockImg)
    for (let i = 0; i < randomNumber(3, 5); i++) {
        buildCratePile(randomNumber(600, 1000));
    }
    buildTower(1500);
    buildSmallArena(randomNumber(5000, 7500));
}