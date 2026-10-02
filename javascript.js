// import { buildMap } from './maps.js';

export const canvas = document.getElementById('game');
export const ctx = canvas.getContext('2d');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const playerImg = new Image();
const test = new Image();
const blockImg = new Image();
const bgImage = new Image();
const hudImg = new Image();
const shovelImg = new Image();
const placeholder = new Image();

const bgParaFactor = 0.5;

playerImg.src = 'declan.png'
test.src = 'judeAndMagdalene.jpg'
blockImg.src = 'blocks.svg'
bgImage.src = 'backgroundLoop.svg'
hudImg.src = 'hud-outline.svg'
shovelImg.src = 'shovel.png'
placeholder.src = 'placeholder.png'

// let player = {
//     x: 100,
//     y: 180,
//     size: 30,
//     speed: 10,
//     jumpHeight: -10,
//     velocityY: 0,
//     gravity: 0.65,
//     isOnGround: false,
//     facing: 'right',
//     currentItem: NaN,
// };
class playerClass {
    constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.jumpHeight = -10;
        this.velocityY = 0;
        this.gravity = 0.65;
        this.isOnGround = false;
        this.facing = 'right';
        this.currentItem = NaN;
    };
    draw(ctx) {
        ctx.save();
        if (this.facing === 'left') {
            ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
            ctx.scale(-1, 1);
            ctx.drawImage(playerImg, -this.size / 2, -this.size / 2, this.size, this.size);
            if (this.currentItem) {
                ctx.drawImage(this.currentItem, this.size / 2, - 5, 20, 20,)
            }
        } else {
            ctx.drawImage(playerImg, this.x, this.y, this.size, this.size);
            if (this.currentItem) {
                ctx.drawImage(this.currentItem, this.x + this.size, this.y + this.size / 2 - 5, 20, 20,)
            }
        }

        ctx.restore();
    }
}
const player = new playerClass(100, 180, 30, 10)

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
    collidesWithOther(other) {
        return(
            other.x + other.width > this.x &&
            other.x < this.x + this.width &&
            other.y + other.height > this.y &&
            other.y < this.y + this.height
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
    };
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
class hudItem {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    };
    draw(ctx) {
        ctx.drawImage(hudImg, this.x, this.y, this.width, this.height);
        ctx.font = '48px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText(`Health ${ healthAmount }`, this.x + 20, this.y + 60);
    }
}

// function checkCollisionsEnemyFirst() {
//     return enemies.some(enemy => 
//         obstacles.some(obstacle => obstacle.collidesWith(enemy))
//     )
// }

class enemyBasic {
    constructor(x, y, width, height, health, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.health = health;
        this.speed = speed;

        this.targetX = x;
        this.targetY = y;

        this.timer = 0;
        this.intervals = 30;
        this.cooldown = 120;

    }
    checkCollisionsEnemyFirst() { 
        return obstacles.some(obstacle => obstacle.collidesWithOther(this))
    }
    update() {
        this.timer++;
        if (this.timer >= this.intervals) {
            this.targetX = player.x + (player.size / 2) - (this.width / 2);
            this.targetY = player.y + (player.size / 2) - (this.height / 2);
            this.timer = 0;
        }

        if (this.cooldown > 0) {
            this.cooldown--;
        }

        if (isOverLaping(this.x, this.y, 50, 50)) {
            console.log('stuck')
            this.x += 1
        }

        let distanceX = this.targetX - this.x;
        let distanceY = this.targetY - this.y;

        let distance = Math.hypot(distanceX, distanceY);

        if (distance > 5) {
            let moveX = (distanceX / distance) * this.speed;
            let moveY = (distanceY / distance) * this.speed;
            
            this.x += moveX
            // this.y += moveY

            if (this.checkCollisionsEnemyFirst()) {
                this.x -= moveX
                // this.y -= moveY
            }            
        }
        if (distance <= 25) {
            if (this.cooldown <= 0) {
                dealDamageToPlayer(10);
                this.cooldown = 60;
            }
        }
        if (healthAmount <= 0) {
            console.log('End')
        }
    };

    draw(ctx) {
        // ctx.drawImage(test, this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.font = '16px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText(`Health ${ this.health }`, this.x - this.width / 4, this.y - 10);
    }
}

function drawProjectile(ctx, img, x, y, width, height, angleInRadians) {
    ctx.save()
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(angleInRadians);
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();
}

class projectile {
    constructor(x, y, mouseX, mouseY, speed = 8) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.secondX = mouseX;
        this.secondY = mouseY;
        this.speed = speed;

        let dx = mouseX - this.x;
        let dy = mouseY - this.y;

        this.angle = Math.atan2(dy, dx);

        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;

    };
    collidesWithOther(other) {
        return(
            other.x + other.width > this.x &&
            other.x < this.x + this.width &&
            other.y + other.health > this.y &&
            other.y < this.y + this.height
        );
    };
    update() {
        // let angle = Math.atan(this.secondY - this.y, this.secondX - this.x);
        // drawProjectile(ctx, test, this.x, this.y, 100, 100, angle);
        this.x += this.vx;
        this.y += this.vy;
    };
    draw(ctx) {
        drawProjectile(ctx, test, this.x, this.y, this.width, this.height, this.angle);
    };  
}

const playerHealth = new hudItem(50, 0, 300, 90)

// const newEnemy = new enemyBasic(100, canvas.height - 50, 50, 50, 100, 0.05)

let keys = {};

window.addEventListener('keydown', e => keys[e.key] = true)
window.addEventListener('keyup', e => keys[e.key] = false)

let obstacles = [
    // new Obstacle(400, canvas.height - 50, 50, 50, 4),
    // new Obstacle(300, canvas.height - 50, 50, 50, 4),
    // new Obstacle(200, canvas.height - 90, 50, 50, 4),
    // new Obstacle(100, canvas.height - 50, 50, 50, 4),
]

let enemies = [
    new enemyBasic(100, canvas.height - 50, 50, 50, 100, 5)
]

const projectiles = [];

let allInventorySlots = []

const startInventoryX = 50;
const startInventoryY = 100;
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

let healthAmount = 100;

function dealDamageToPlayer(damageAmount) {
    healthAmount -= damageAmount;
}

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
    for (let enemy of enemies) {
        enemy.x -= moveAmount
    }
    if (checkCollisionsFirst()) {
        for (let obstacle of obstacles) {
            obstacle.x += moveAmount;
        }
        for (let enemy of enemies) {
            enemy.x += moveAmount
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
    for (let enemy of enemies) {
        enemy.x += moveAmount
    }
    if (checkCollisionsFirst()) {
        for (let obstacle of obstacles) { 
            obstacle.x -= moveAmount;
        }
    for (let enemy of enemies) {
        enemy.x -= moveAmount
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

// dealDamageToPlayer(10)

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
                if (slot.item === shovelImg) {
                    console.log('shovel')
                    player.currentItem = shovelImg;
                    return true;
                } 
                if (slot.item === test) {
                    if (healthAmount === 100 || healthAmount >= 100) {
                        return true;
                    }
                    if (healthAmount <= 90) {
                        healthAmount += 10;
                    } else {
                        healthAmount = 100
                    }
                }
                if (slot.item === placeholder) {
                    player.currentItem = placeholder;
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
    if (player.currentItem === shovelImg) {
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
}

addItemToInventory(shovelImg)
addItemToInventory(placeholder)
addItemToInventory(blockImg)
addItemToInventory(test)
// dealDamageToPlayer(5)

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
    if (player.currentItem === placeholder) {
        projectiles.push(new projectile(player.x, player.y, mouseX, mouseY, 8));
    }
})

window.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        jump()
    }
})

let currentMouseX = 0;
let currentMouseY = 0;

window.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    currentMouseX = event.clientX - rect.left;
    currentMouseY = event.clientY - rect.top;

})

// window.addEventListener('keydown', (event) => {
//     if ((event.key === 'r' || event.key === 'R') && !event.repeat) {
//     projectiles.push(new projectile(player.x, player.y, currentMouseX, currentMouseY, 8));
//     }
// })

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

    if (healthAmount > 100) {
        healthAmount = 100
    }

    // const rect = canvas.getBoundingClientRect();
    // const mouseX = event.clientX - rect.left;
    // const mouseY = event.clientY - rect.top;
    // new projectile(200, canvas.height - 100, mouseX, mouseY)


    const groundLevel = canvas.height - player.size;

    for (let enemy of enemies) {
        enemy.update()
    }

    if (player.y > groundLevel) {
        player.y = groundLevel;
        player.velocityY = 0;
        player.isOnGround = true;
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        if (!p) continue;
        const hitEnemy = enemies.find(enemy => p.collidesWithOther(enemy));
        if (hitEnemy) {
            projectiles.splice(i, 1);
            hitEnemy.health -= 10;
            console.log('hit')
            console.log(`Enemy Health: ${ hitEnemy.health }`)
        }
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

    playerHealth.draw(ctx)

    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        p.update();
        p.draw(ctx);
        
        if (
            p.x < -p.width ||
            p.x > canvas.width + p.width ||
            p.y < -p.height ||
            p.y > canvas.height + p.height
        ) {
            projectiles.splice(i, 1)
        }
    }

    enemies.forEach(enemy => enemy.draw(ctx))
    // newEnemy.draw(ctx)
    player.draw(ctx)
}

function gameLoop() {
    update();
    draw();
    
    requestAnimationFrame(gameLoop);
}

gameLoop()