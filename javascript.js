// import { buildMap } from './maps.js';
import { playerClass, Obstacle, inventorySlot, } from './classes.js';

export const canvas = document.getElementById('game');
export const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const playerImg = new Image();
const test = new Image();
const blockImg = new Image();
const bgImage = new Image();
const hudImg = new Image();
const shovelImg = new Image();
const placeholder = new Image();
const arrowImg = new Image();
const axImg = new Image();
const crateImg = new Image();
const enemyImg = new Image();
const damagedImg = new Image();

const bgParaFactor = 0.5;

playerImg.src = 'declan.png'
test.src = 'judeAndMagdalene.jpg'
blockImg.src = 'blocks.svg'
bgImage.src = 'backgroundLoop.svg'
hudImg.src = 'hud-outline.svg'
shovelImg.src = 'shovel.png'
placeholder.src = 'placeholder.png'
arrowImg.src = 'arrow.png'
axImg.src = 'ax.png'
crateImg.src = 'crate.png'
enemyImg.src = 'enemy.png'
damagedImg.src = 'damage.png'

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

let healthAmount = 100;

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

function dealDamageToPlayer(damageAmount) {
    healthAmount -= damageAmount / player.armorMultiplier;
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




// function checkCollisionsEnemyFirst() {
//     return enemies.some(enemy => 
//         obstacles.some(obstacle => obstacle.collidesWith(enemy))
//     )
// }

class enemyBasic {
    constructor(x, y, width, height, health, speed, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.health = health;
        this.speed = speed;
        this.gravity = 0.65;
        this.velocityY = 0;
        this.isOnGround = false;
        this.jumpHeight = -10;
        this.image = image;

        this.targetX = x;
        this.targetY = y;

        this.timer = 0;
        this.intervals = 30;
        this.cooldown = 120;
        this.jumpTimer = 0;
        this.jumpTimerIntervals = 120;

    }
    checkCollisionsEnemyFirst() { 
        return obstacles.some(obstacle => obstacle.collidesWithOther(this))
    }
    jump() {
        if (this.isOnGround) {
            this.velocityY = this.jumpHeight;
            this.isOnGround = false;
        }
    }
    update() {
        this.timer++;
        this.jumpTimer++;
        if (this.timer >= this.intervals) {
            this.targetX = player.x + (player.size / 2) - (this.width / 2);
            this.targetY = player.y + (player.size / 2) - (this.height / 2);
            this.timer = 0;
        }

        if (this.jumpTimer > this.jumpTimerIntervals) {
            this.jumpTimer = this.jumpTimerIntervals + 1
        }

        if (this.jumpTimer >= this.jumpTimerIntervals) {
            if (player.y < this.y) {
                this.jump()
                this.jumpTimer = 0;
            }
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

            if (this.checkCollisionsEnemyFirst()) {
                this.x -= moveX
            }            
        }
        if (distance <= 25) {
            if (this.cooldown <= 0) {
                dealDamageToPlayer(10);
                this.cooldown = 60;
            }
        }
    };

    draw(ctx) {
        // ctx.drawImage(test, this.x, this.y, this.width, this.height);
        // ctx.fillStyle = 'red';
        // ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        ctx.font = '16px sans-serif';
        ctx.fillStyle = 'white';
        // ctx.fillText(`Health ${ this.health }`, this.x - this.width / 4, this.y - 10);
        if (this.health >= 100) {
            ctx.fillStyle = 'green'
            ctx.fillText(`█████`, (this.x + this.width / 2) - 40, this.y - 10);
        }
        if (this.health >= 75 && this.health < 100) {
            ctx.fillStyle = 'yellow'
            ctx.fillText(`████ `, (this.x + this.width / 2) - 40, this.y - 10);
        }
        if (this.health >= 50 && this.health < 75) {
            ctx.fillStyle = 'orange'
            ctx.fillText(`███  `, (this.x + this.width / 2) - 40, this.y - 10);
        }
        if (this.health >= 25 && this.health < 50) {
            ctx.fillStyle = 'red'
            ctx.fillText(`██   `, (this.x + this.width / 2) - 40, this.y - 10);
        }
        if (this.health >= 0 && this.health < 25) {
            ctx.fillStyle = '#820707'
            ctx.fillText(`█   `, (this.x + this.width / 2) - 40, this.y - 10);
        }
        
        // ctx.fillText(`Jump Delay ${ this.jumpTimer }`, this.x - this.width / 4, this.y - 30);
    }
}

// █

window.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    currentMouseX = event.clientX - rect.left;
    currentMouseY = event.clientY - rect.top;

})

function drawProjectile(ctx, img, x, y, width, height, angle) {
    const projectileDX = currentMouseX - x;
    const projectileDY = currentMouseY - y;

    const projectileAngle = Math.atan2(projectileDY, projectileDX)

    ctx.save()
    // ctx.translate(x + width / 2, y + height / 2);
    ctx.translate(x, y)
    ctx.rotate(angle + Math.PI / 2);
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();
}

class projectile {
    constructor(x, y, mouseX, mouseY, image, speed = 8) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.secondX = mouseX;
        this.secondY = mouseY;
        this.speed = speed;
        this.image = image;

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
            other.y + other.height > this.y &&
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
        // ctx.save();
        // ctx.translate(this.x, this.y);
        // ctx.rotate(-90)
        drawProjectile(ctx, this.image, this.x, this.y, this.width, this.height, this.angle);
        
        // ctx.restore();
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
    new enemyBasic(100, canvas.height - 50, 50, 50, 100, 5, enemyImg)
]

function spawnEnemy(x, width, height, health, speed) {
    enemies.push(new enemyBasic(x, canvas.height - height, width, height, health, speed))
}

function summonWaves() {
    for (let i = 0; i < 5; i++) {
        spawnEnemy(200 + (i * 100), 50, 50, 100, 5);
        console.log(5 + (i * 1.15))
    }
}



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



function attackFromPlayer(damageAmount) {
    const attackLeft = player.x - 100;
    const attackRight = (player.x + player.size) + 100;
    player.rotationAngle += 45
    player.rotationAngle -= 45
    for (let enemy of enemies) {
        const enemyLeft = enemy.x;
        const enemyRight = enemy.x + enemy.width;
        const attackRange = enemyRight >= attackLeft && enemyLeft <= attackRight;
        if (attackRange) {
            enemy.health -= (damageAmount * player.damageMultiplier)
        }
    }
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
                        let offset
                        if (player.facing === 'left') {
                            offset = -40
                        } else {
                            offset = (player.x + player.size) - 75
                        }
                        const buildObstacleX = player.x + offset;
                        const buildObstacleY = canvas.height - 50;
                        if (isOverLaping(buildObstacleX, buildObstacleY, 50, 50)) return true;
                        buildObstacleAtPlayer()
                        // slot.item = false
                        return true;
                    }
                    return true;
                }
                if (slot.item === shovelImg) {
                    console.log('shovel')
                    player.currentItem = shovelImg;
                    player.damageMultiplier = 1.5;
                    return true;
                } 
                if (slot.item === axImg) {
                    console.log('ax')
                    player.currentItem = axImg;
                    player.damageMultiplier = 1.75;
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
            player.currentItem = null;

            return true;
        }
    }
    return false;
}

let lootpool = [test, blockImg]

function checkObstaclesClicked(mouseX, mouseY) {
    if (player.currentItem === shovelImg || player.currentItem === axImg) {
        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i]
            if (obstacle.containsPoint(mouseX, mouseY)) {
                console.log('Block Clicked');
                if (obstacle.health === 2) {
                    obstacle.health -= 1;
                    return;
                }
                if (obstacle.health !== 2) {

                }
                    if (obstacle.image === blockImg) {
                        const addedItem = addItemToInventory(blockImg);
                        if (addedItem) {
                            obstacles.splice(i, 1);
                            return true;
                        } else {
                            return false;
                        }
                    }
                    if (obstacle.image === crateImg) {
                        const randomLootPoolIndex = Math.floor(Math.random() * lootpool.length);
                        const chosenLootPool = lootpool[randomLootPoolIndex];
                        const addedItem = addItemToInventory(chosenLootPool);
                        if (addedItem) {
                            obstacles.splice(i, 1);
                            return true;
                        } else {
                            return false;
                        }
                    }
            }
        }
        return false;
    }
}

addItemToInventory(shovelImg)
addItemToInventory(axImg)
addItemToInventory(placeholder)
addItemToInventory(blockImg)
addItemToInventory(blockImg)
addItemToInventory(test)
// dealDamageToPlayer(5)

function clearInventory() {
    for (let slot of allInventorySlots) {
        if (slot.item !== shovelImg || slot.item !== axImg) {
            slot.item = null
        }
    }
    const hasStarterItem = allInventorySlots.some(slot => slot.item === shovelImg);
    const hasStarterItemSecond = allInventorySlots.some(slot => slot.item === axImg);
        if (hasStarterItem && hasStarterItemSecond) {
            console.log('Has Shovel');
            return;
        }
    addItemToInventory(shovelImg)
    addItemToInventory(axImg)
}
function playerDeath() {
    clearInventory();
    healthAmount = 100;
}

window.addEventListener('keydown', e => {
    if ((e.key === 'g' || e.key == 'G') && !e.repeat) {
    }
});


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

    obstacles.push(new Obstacle(gridX, gridY, width, height, speed, blockImg))
    return true;
}

obstacles.push(new Obstacle(350, canvas.height - 50, 50, 50, 4, crateImg))

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
        console.log('projectile')
        projectiles.push(new projectile(player.x + player.size, player.y + player.size - 5, mouseX, mouseY, arrowImg,8));
    } else {
        attackFromPlayer(10)
        player.attack()
    }
})

window.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        jump()
    }
})

let currentMouseX = 0;
let currentMouseY = 0;



// window.addEventListener('keydown', (event) => {
//     if ((event.key === 'r' || event.key === 'R') && !event.repeat) {
//     projectiles.push(new projectile(player.x, player.y, currentMouseX, currentMouseY, 8));
//     }
// })

window.addEventListener('keydown', e => {
    if ((e.key === 'e' || e.key == 'E') && !e.repeat) {
        const explinationTitle = document.getElementById('explinations')
        explinationTitle.textContent = ' '
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
    
    
    for (let enemy of enemies) {
        enemy.isOnGround = false;
        
        const groundLevelEnemy = canvas.height - enemy.height;
        enemy.velocityY += enemy.gravity;
        enemy.y += enemy.velocityY;

        if (enemy.y > groundLevelEnemy) {
            enemy.y = groundLevelEnemy;
            enemy.velocityY = 0;
            enemy.isOnGround = true;
        }
    }

    enemies = enemies.filter(enemy => enemy.health > 0);

    if (healthAmount > 100) {
        healthAmount = 100
    }

    

    if (player.y > groundLevel) {
        player.y = groundLevel;
        player.velocityY = 0;
        player.isOnGround = true;
    }

    if (healthAmount <= 0) {
        playerDeath()
    }

    player.updateAttack()

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
        for (let enemy of enemies) {
            if (obstacle.collidesWithOther(enemy)) {
                const overlapEnemyX = (enemy.x + enemy.width / 2) - (obstacle.x + obstacle.width / 2);
                const overlapEnemyY = (enemy.y + enemy.height / 2) - (obstacle.y + obstacle.height / 2);

                const minOverlapEnemyX = (enemy.width + obstacle.width) / 2 - Math.abs(overlapEnemyX);
                const minOverlapEnemyY = (enemy.height + obstacle.height) / 2 - Math.abs(overlapEnemyY);

                if (minOverlapEnemyX < minOverlapEnemyY) {
                    if (overlapEnemyX > 0) {
                        enemy.x = obstacle.x + obstacle.width;
                    } else {
                        enemy.x = obstacle.x - enemy.width;
                    }
                } else {
                    if (overlapEnemyY < 0) {
                        enemy.y = obstacle.y - enemy.height;
                        enemy.velocityY = 0;
                        enemy.isOnGround = true;
                    } else {
                        enemy.y = obstacle.y + obstacle.height;
                        if (enemy.velocityY < 0) {
                            enemy.velocityY = 0;
                        }
                    }
                }
            }
        }
    }
    for (let enemy of enemies) {
        enemy.update()
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