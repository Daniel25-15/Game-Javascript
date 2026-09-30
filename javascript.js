// import { buildMap } from './maps.js';

export const canvas = document.getElementById('game');
export const ctx = canvas.getContext('2d');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const playerImg = new Image();
const test = new Image();
const blockImg = new Image();
const bgImage = new Image();

const bgParaFactor = 0.5;

playerImg.src = 'declan.png'
test.src = 'judeAndMagdalene.jpg'
blockImg.src = 'blocks.svg'
bgImage.src = 'backgroundLoop.svg'

let player = {
    x: 100,
    y: 180,
    size: 30,
    speed: 10,
    jumpHeight: -10,
    velocityY: 0,
    gravity: 0.6,
    isOnGround: false,
    facing: 'right',
};

let cameraX = 0;

function drawBackground() {
    if (!bgImage.complete) return;
    
    const bgWidth = canvas.width * 1.5;
    const bgHeight = canvas.height * 1;

    let offsetX = ((cameraX * bgParaFactor) % bgWidth + bgWidth) % bgWidth;
    
    if (offsetX < 0) {
        offsetX += bgWidth;
    }

    // console.log('Player X:', player.x, 'Offset X:', offsetX);

    ctx.drawImage(bgImage, -offsetX, 0, bgWidth, bgHeight);
    ctx.drawImage(bgImage, -offsetX + bgWidth, 0, bgWidth, bgHeight);

    ctx.drawImage(bgImage, -offsetX - bgWidth, 0, bgWidth, bgHeight);
}

class Obstacle{
    constructor (x, y, width, height, speed, color = "#b51212") {
        this.x = x;
        this.y = y;
        this.width = width,
        this.height = height,
        // this.size = ;
        this.speed = speed;
        this.color = color;
    }
    draw(ctx) {
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.drawImage(blockImg, this.x, this.y, this.width, this.height)
    }
    collidesWith(player) {
        return(
            player.x + player.size > this.x &&
            player.x < this.x + this.width &&
            player.y + player.size > this.y &&
            player.y < this.y + this.height
        );
    }
    containsPoint(px, py) {
        // if (!this.visible) return false;
        return (
            px >= this.x &&
            px <= this.x + this.width &&
            py >= this.y &&
            py <= this.y + this.height
        );
    }
}

class inventorySlot {
    constructor(x, y, width, height, item, color = "#504d4d") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.item = item;
        this.color = color;
        this.visible = false;
    }
    draw(ctx) {
        if (this.visible) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else {
            return;
        }
        if (this.item) {
            const paddingMultiplier = 0.7
            const itemWidth = this.width * paddingMultiplier
            const itemHeight = this.height * paddingMultiplier

            const itemX = this.x + (this.width - itemWidth) / 2;
            const itemY = this.y + (this.height - itemHeight) / 2;
            if (this.item && this.item.complete && this.item.naturalWidth !== 0) {
                ctx.drawImage(this.item, itemX, itemY, itemWidth, itemHeight);
            }
        }
    }
    containsPoint(px, py) {
        if (!this.visible) return false;
        return (
            px >= this.x &&
            px <= this.x + this.width &&
            py >= this.y &&
            py <= this.y + this.height
        );
    }
}

let keys = {};

window.addEventListener('keydown', e => keys[e.key] = true)
window.addEventListener('keyup', e => keys[e.key] = false)

let obstacles = [
    // new Obstacle(400, canvas.height - 50, 50, 50, 4),
    // new Obstacle(300, canvas.height - 50, 50, 50, 4),
    // new Obstacle(200, canvas.height - 90, 50, 50, 4),
    // new Obstacle(100, canvas.height - 50, 50, 50, 4),
]

let allInventorySlots = []

const startInventoryX = 50;
const startInventoryY = 50;
const inventoryPadding = 10;

const inventorySlotsAmount = 30;
const itemsPerRow = 10;

for (let i = 0; i < inventorySlotsAmount; i ++) {
    const column = i % itemsPerRow;
    const row = Math.floor(i / itemsPerRow);

    const x = startInventoryX + column * (50 + inventoryPadding);
    const y = startInventoryY + row * (50 + inventoryPadding);

    allInventorySlots.push(new inventorySlot(x, y, 50, 50, null))
}

// allInventorySlots.push(new inventorySlot(150, 250, 50, 50, true))

function forClickedInventorySlot(itemImage) {
    for (let slot of allInventorySlots) {
        slot.item = itemImage;
    }
}

function addItemToInventory(itemImage) {
    const emptySlot = allInventorySlots.find(slot => !slot.item);
    if (emptySlot) {
        emptySlot.item = itemImage;
        return true;
    }
    return false;
}

function checkCollisionsFirst() {
    return obstacles.some(obstacle => obstacle.collidesWith(player));
}

function jump() {
    if (player.isOnGround) {
        player.velocityY = player.jumpHeight;
        player.isOnGround = false;
    }
}
function moveRight() {
    player.facing = 'right';
    const moveAmount = player.speed;

    cameraX += moveAmount

    for (let obstacle of obstacles) {
        obstacle.x -= moveAmount
    }
    if (checkCollisionsFirst()) {
        for (let obstacle of obstacles) {
            obstacle.x += moveAmount;
  
        }
        cameraX -= moveAmount
    }
}
function moveLeft() {
    player.facing = 'left';
    const moveAmount = player.speed;

    cameraX -= moveAmount

    for (let obstacle of obstacles) {
        obstacle.x += moveAmount
    }
    if (checkCollisionsFirst()) {
        for (let obstacle of obstacles) { 
            obstacle.x -= moveAmount;
        }
        cameraX += moveAmount;
    }
}

function buildObstacleAtPlayer() {
    if (player.isOnGround) {
        const slotWithBlock = allInventorySlots.find(s => s.item === blockImg);
        if (!slotWithBlock) return;
        // const offset = player.facing === 'left' ? -50 : player.width + 10;
        let offset
        if (player.facing === 'left') {
            offset = -40
        } else {
            offset = (player.x + player.size) - 75
        }
        const buildObstacleX = player.x + offset;
        const buildObstacleY = canvas.height - 50;

        if (isOverLaping(buildObstacleX, buildObstacleY, 50, 50)) {
            console.log('No space')
            return;
        }
        addObstacle(buildObstacleX, buildObstacleY, 50, 50, 4)
        slotWithBlock.item = false;
    }
}


function toggleInventory() {
    for (let slot of allInventorySlots) {
        slot.visible = !slot.visible;
    }
}

function checkInventorySlotsClicked(mouseX, mouseY) {
    for (let slot of allInventorySlots) {
        if (slot.containsPoint(mouseX, mouseY)) {
            if (slot.item) {
                if (slot.item === playerImg) {
                    console.log('player image');
                }
                if (slot.item === blockImg) {
                    if (player.isOnGround){
                        buildObstacleAtPlayer()
                        slot.item = false
                    }
                    return true;
                }
                slot.item = false
                return true;
            }
            // slot.item = playerImg;
            return true;
        }
    }
    return false;
}

function checkObstaclesClicked(mouseX, mouseY) {
    // for (let obstacle of obstacles) {
    //     if (obstacle.containsPoint(mouseX, mouseY)) {
    //         console.log('Block Clicked')
    //         obstacles.pop(obstacle)
    //         addItemToInventory(blockImg)
    //         return true;
    //     }
    // }
    // return false;

    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i]
        if (obstacle.containsPoint(mouseX, mouseY)) {
            console.log('Block Clicked');
            const addedItem = addItemToInventory(blockImg);
            if (addedItem) {
                obstacles.splice(i, 1);
                return true;
            } else {
                return false;
            }
        }
    }
    return false;
}

addItemToInventory(blockImg)

function isOverLaping(newX, newY, width, height) {
    return obstacles.some(obstacle => {
        return (
            newX < obstacle.x + obstacle.width &&
            newX + width > obstacle.x &&
            newY < obstacle.y + obstacle.height &&
            newY + height > obstacle.y
        );
    });
}

function addObstacle(obstacleX, obstacleY, width = 50, height = 50, speed) {
        // return new Obstacle(250, canvas.height - 50, 100, 50, 4);
    const gridSize = 50;
    const gridX = Math.floor(obstacleX / gridSize) * gridSize;
    const gridY = Math.floor(obstacleY / gridSize) * gridSize;

    if (isOverLaping(gridX, gridY, width, height)) {
        console.log('Grid slot taken')
        return false;
    }

    obstacles.push(new Obstacle(gridX, gridY, width, height, speed))
    return true;
}
function buildMap(mapNumber) {
    if (mapNumber === 'mapDefault') {
        // console.log('imported file')
        addObstacle(150, canvas.height - 50, 50, 75, 4)
    }
}
buildMap('mapDefault')
function clearMap() {
    while (obstacles.length > 0) {
        obstacles.pop()
    }
}
// clearMap()


window.addEventListener('keydown', e => {
    if ((e.key === 'q' || e.key == 'Q') && !e.repeat) {
        buildObstacleAtPlayer()
    }
});


window.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    if (checkInventorySlotsClicked(mouseX, mouseY)) return;
    if (checkObstaclesClicked(mouseX, mouseY)) return;
    jump()
})

window.addEventListener('keydown', e => {
    if ((e.key === 'e' || e.key == 'E') && !e.repeat) {
        const explinationTitle = document.getElementById('explinations')
        explinationTitle.textContent = 'Good Job!'
        toggleInventory(playerImg)
    }
});

function update() {
    if (keys['ArrowRight'] || keys['d']) moveRight();
    if (keys['ArrowLeft'] || keys['a']) moveLeft();
    if (keys['ArrowUp'] || keys['w']) jump();

    player.x = Math.max(0, Math.min(canvas.width - player.size, player.x))

    player.y = Math.max(0, Math.min(canvas.height - player.size, player.y))

    player.velocityY += player.gravity;
    player.y += player.velocityY;

    const groundLevel = canvas.height - player.size;

    if (player.y > groundLevel) {
        player.y = groundLevel;
        player.velocityY = 0;
        player.isOnGround = true;
    }
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        if (obstacle.collidesWith(player)) {
            const overlapX = (player.x + player.size / 2) - (obstacle.x + obstacle.width / 2);
            const overlapY = (player.y + player.size / 2) - (obstacle.y + obstacle.height / 2);

            const minOverlapX = (player.size + obstacle.width) / 2 - Math.abs(overlapX);
            const minOverlapY = (player.size + obstacle.height) / 2 - Math.abs(overlapY);

            if (minOverlapX < minOverlapY) {
                if (overlapX > 0) {
                    player.x = obstacle.x + obstacle.width;
                } else {
                    player.x = obstacle.x - player.size;
                }
            } else {
                if (overlapY > 0) {
                    player.y = obstacle.y + obstacle.height;
                    player.velocityY = 0;
                } else {
                    player.y = obstacle.y - player.size;
                    player.velocityY = 0;
                    player.isOnGround = true;
                }
            }
        }
    }
}

function draw() {
    drawBackground();

    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    obstacles.forEach(obstacle => obstacle.draw(ctx))

    allInventorySlots.forEach(inventorySlot => inventorySlot.draw(ctx))

    ctx.save();

    if (player.facing === 'left') {
        ctx.translate(player.x + player.size / 2, player.y + player.size / 2);
        ctx.scale(-1, 1);
        ctx.drawImage(playerImg, -player.size / 2, -player.size / 2, player.size, player.size);
    } else {
        ctx.drawImage(playerImg, player.x, player.y, player.size, player.size);
    }
    ctx.restore();
}

function gameLoop() {
    update();
    draw();
    
    requestAnimationFrame(gameLoop);
}

gameLoop()